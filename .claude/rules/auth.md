# Authentication (Clerk)

Authentication is handled exclusively by **Clerk** (`@clerk/clerk-react`). There is no custom auth state, no JWT handling, no refresh-token logic.

## 1 — Provider wiring (do not touch unless deliberately changing the auth model)

`src/main.tsx` wraps the app with `<ClerkProvider>` **inside** `<QueryClientProvider>` and **outside** `<RouterProvider>`:

```tsx
<QueryClientProvider client={queryClient}>
    <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
        appearance={{ theme: shadcn }}
        localization={i18n.language === "en-US" ? enUS : arSA}
    >
        <RouterProvider router={router} />
    </ClerkProvider>
</QueryClientProvider>
```

- The Clerk theme is `shadcn` from `@clerk/themes`.
- Localization comes from `@clerk/localizations` (`enUS` / `arSA`) and is selected from the current i18n language: `localization={i18n.language === "en-US" ? enUS : arSA}`.
- The whole app re-renders on `i18n.languageChanged` so that Clerk picks up the new localization. **Don't break this `mainRender()` re-binding.**

## 2 — Token forwarding to Axios

`src/services/API.ts` declares a single Axios request interceptor that calls a lazily-set `clerkGetToken()`:

```ts
let clerkGetToken: GetTokenFunctionType | null = null;
export function setClerkGetToken(getToken: GetTokenFunctionType) {
    clerkGetToken = getToken;
}

axios.interceptors.request.use(async (config) => {
    if (clerkGetToken) {
        const token = await clerkGetToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    // Strip auth for known third-party endpoints (e.g. presigned S3 URLs, public lambdas):
    if (config.url?.includes("amazonaws")) config.headers.Authorization = undefined;
    if (config.url?.includes("lambda")) config.withCredentials = false;
    return config;
});
```

`__root.tsx` runs this once:

```tsx
const { getToken } = useAuth();
useEffect(() => {
    setClerkGetToken(getToken);
}, [getToken]);
```

Rules:

- Never import `axios` directly into a component or hook. Always go through `@/services/API`.
- Don't add new auth interceptors. If a route bypasses bearer auth, special-case it in the same interceptor file by inspecting `config.url`.

## 3 — Route-level gating

Route gating is done via three pathless layout routes — pick the right one for the page you're adding:

| Layout      | Purpose                         | Behavior                                                                                                                                    |
| ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `_app.tsx`  | Authenticated app shell         | If `!isLoaded` → `<SpinnerPage />`. Else `<Protect fallback={<Navigate to="/signin" replace />}>`.                                          |
| `_auth.tsx` | Unauthenticated auth screens    | If `!isLoaded` → `<SpinnerPage />`. If signed in → `<Navigate to="/<post-login-route>" replace />`. Else render `<SignedOut>{children}</SignedOut>`. |
| `_base.tsx` | Unauthenticated public pages    | Same gating as `_auth.tsx` but renders the public/marketing layout. Skip if the project has no public surface.                              |

Rules:

- Use `useAuth().isLoaded` and the `<Protect>` / `<SignedOut>` components from `@clerk/clerk-react`. Don't roll your own auth-state booleans.
- The Clerk-managed sign-in screen is mounted at `/signin` via `<SignIn />` from `@clerk/clerk-react`. Don't build a custom sign-in form.
- The header avatar / sign-out menu is `<UserButton />` from `@clerk/clerk-react`, placed in `AppHeader.tsx`.

## 4 — Reading role and permissions (per-scope access endpoint)

User role and per-scope permissions are fetched from the backend via `GET /access/:scopeId` — never from Clerk `publicMetadata`. The response is a discriminated union; the exact shape lives in `src/services/access/Access.api.ts`:

```ts
type Permission = { /* per-feature booleans */ };
type AdminAccess = { eventId: string; role: typeof RoleTypes.ADMIN; hasAccess: true };
type StaffAccess = { eventId: string; role: typeof RoleTypes.STAFF; hasAccess: true; permissions: Permission };
type Access = AdminAccess | StaffAccess;
type AccessAccount = { clerkId: string; email: string | null; name: string | null; imageUrl: string | null; permissions: Permission };
```

Read it via the `useGetAccess` hook:

```tsx
const { selectedEvent } = useSelectedEvent();
const { access } = useGetAccess(selectedEvent);

const isAdmin = access?.role === RoleTypes.ADMIN;
const permissions = access?.role === RoleTypes.STAFF ? access.permissions : null;
const showFeatureNav = isAdmin || permissions?.<feature>;
```

- `RoleTypes` lives in `src/lib/enums.ts`. The per-scope `Permission` and `Access` types live in `src/services/access/Access.api.ts`.
- Access grant management uses `GET /access/grants/:eventId`, `POST /access/grants/:eventId`, `PATCH /access/grants/:eventId/:clerkId`, and `DELETE /access/grants/:eventId/:clerkId`. Grant rows are `AccessAccount` records keyed by `clerkId`, not `_id`.
- The hook is keyed `["access", scopeId]` with `enabled: !!scopeId` and `retry: false`. A 401/403 leaves `access` undefined, which fails closed (no nav, no admin controls).
- Always derive UI gating from `role === RoleTypes.ADMIN` **OR** the per-scope permission boolean.
- Admin-only surfaces such as the access nav item render only when `access?.role === RoleTypes.ADMIN`. Direct route access still relies on backend authorization and renders the normal route error state if the access query fails.
- Capabilities not scoped to a single event (e.g. "create event") cannot be gated by this endpoint — render them for any signed-in user and let the backend enforce.
- Don't trust client-side gates for data security — they're UX hints only. The backend enforces real authorization.

## 5 — Sign-out and post-auth redirect

- Sign-out happens via `<UserButton />` (Clerk-managed).
- Post-sign-in redirect is handled by `_auth.tsx` checking `isSignedIn` and `<Navigate to="/<post-login-route>" replace />`.
- Don't add manual `signOut()` calls or `router.navigate` after auth events.

## 6 — Don't do

- Don't store auth tokens in `localStorage`, `sessionStorage`, or React state.
- Don't add a custom `axios.create()` instance with its own interceptor.
- Don't read `getToken()` from inside individual API call functions; the root-level interceptor already handles it.
- Don't create new pathless layouts (`_*.tsx`) for auth state. The three established ones cover every case.
