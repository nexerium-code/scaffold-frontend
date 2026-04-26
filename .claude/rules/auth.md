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

## 4 — Reading user metadata

User role and per-scope permissions live in Clerk **public metadata**. The exact shape is project-specific and lives in `src/lib/enums.ts`:

```ts
type Permission = { /* per-feature booleans */ };
type MetaData = { role: RoleType; permissions: Record<string, Permission> | null };
```

Read it via `useUser()`:

```tsx
const { user } = useUser();
const userRole = (user?.publicMetadata as MetaData)?.role;
const perm = (user?.publicMetadata as MetaData)?.permissions?.[selectedScopeId];
const showFeatureNav = userRole === RoleTypes.ADMIN || perm?.<feature>;
```

- The `MetaData` and `RoleTypes` types live in `src/lib/enums.ts`.
- Always derive UI gating from a combination of `role === RoleTypes.ADMIN` **OR** the per-scope permission boolean.
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
