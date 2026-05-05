# Codex Project Rules

Scope: this file applies to the entire repository. If a nested `AGENTS.md` is added later, its instructions apply to files under that nested directory and override conflicting root instructions.

## 1. Core Operating Rules

Consistency is the highest priority. Before editing code, inspect nearby files in the same feature and layer, then match their structure, naming, exports, imports, formatting, data flow, Tailwind usage, error handling, and comment density.

Keep changes tightly scoped to the user request. Do not refactor unrelated code, rename files, change APIs, add dependencies, or introduce new architectural patterns unless explicitly asked.

Use Codex like a maintainer:

- Search with `rg` / `rg --files` first.
- Read relevant existing files before editing.
- Use `apply_patch` for manual edits.
- Preserve user changes and dirty worktree state.
- Never edit generated or CLI-managed files.
- Run project verification after meaningful code changes: `npm run lint` and `npm run build`.
- If verification cannot run, state that in the final response.

Default to local precedent when rules are silent. If written rules and local precedent conflict, follow the written rules.

## 2. Fixed Stack

Use this stack unless the user explicitly approves a change:

- Vite 8
- React 19
- TypeScript strict
- npm with `package-lock.json`
- TanStack Router for file-system routing
- TanStack Query for all server state
- TanStack Table for data tables
- React Hook Form + Zod for forms
- Tailwind CSS 4 via `@tailwindcss/vite`
- shadcn/ui primitives in `src/components/ui`
- Clerk for authentication
- Axios wrapped only by `src/services/API.ts`
- i18next + react-i18next with English and Arabic
- sonner for mutation toasts
- lucide-react for icons
- date-fns / date-fns-tz for date work
- PapaParse for CSV export

Do not add Redux, Zustand, CSS modules, styled-components, another router, another HTTP client, another icon set, or another UI kit.

## 3. Project Structure

Use this `src/` layout:

```txt
src/
    components/
        _app/
        empty-states/
        general/
        skeleton/
        ui/
        <feature>/
    contexts/
    hooks/
        <feature>/
    lib/
    locales/
        en.json
        ar.json
        i18n.ts
    routes/
    services/
        API.ts
        <feature>/
```

Rules:

- `components/<feature>` mirrors `hooks/<feature>` and `services/<feature>`.
- Shared app chrome lives in `components/_app`.
- Generic reusable components live in `components/general`.
- Empty/error states live in `components/empty-states`.
- Skeletons live in `components/skeleton`.
- shadcn primitives live in `components/ui` and are never edited manually.
- Cross-feature contexts live in `contexts`.
- Pure framework-agnostic helpers live in `lib`.
- File-system routes live in `routes`.
- API calls, schemas, and feature helpers live in `services`.

Do not create empty placeholder files. Omit files a feature does not need.

## 4. Imports, Exports, and Naming

Use TypeScript only: `.ts` and `.tsx`.

Use the `@/` alias for imports from `src`. Do not traverse above `src`. Prefer `@/...` for cross-folder imports.

Import order:

1. External packages.
2. Blank line.
3. Internal `@/` imports.

Components:

- File name: `PascalCase.tsx`.
- Component style: `function ComponentName()`.
- Props: `type ComponentNameProps = { ... }`.
- Export: default export at the bottom.
- One primary component per file.

Hooks:

- File and function name: `use<PascalCase>.ts`.
- Export hooks as named exports.
- One hook per file.

Services:

- Folder: lowercase feature name.
- Files: `<Feature>.api.ts`, `<Feature>.schemas.ts`, `<Feature>.helpers.ts`.
- API functions: camelCase named exports.
- Entity API types: singular PascalCase named exports.
- `ENDPOINT` constant: top-level, file-local, not exported.

Routes:

- Static segments: kebab-case.
- Dynamic segments: `$param.tsx`.
- Folder index: `index.tsx`.
- Pathless layouts: `_app.tsx`, `_auth.tsx`, `_base.tsx`.
- Route export must be `export const Route = createFileRoute(...)(...)`.

Prefer `type` over `interface` unless extending a third-party interface. Prefix intentionally unused variables with `_`.

## 5. Formatting and Comments

Use the existing Prettier settings:

```json
{
    "printWidth": 360,
    "tabWidth": 4,
    "semi": true,
    "singleQuote": false,
    "trailingComma": "none",
    "arrowParens": "always"
}
```

Do not hand-sort Tailwind classes. `prettier-plugin-tailwindcss` handles ordering.

Default to no comments. Add comments only for non-obvious reasons, external contracts, hidden invariants, or complex shared utilities. Do not comment ordinary components, simple hooks, or self-explanatory code.

Do not leave debug `console.log` calls in committed application code.

## 6. Routing

Use TanStack Router file-based routing.

`main.tsx` must create the router with:

- `defaultPreload: "render"`
- `scrollRestoration: true`
- `notFoundMode: "root"`
- `defaultErrorComponent` from `components/empty-states`
- router context containing the shared `queryClient`

Root route:

- `__root.tsx` uses `createRootRouteWithContext`.
- Mounts global providers.
- Registers Clerk token forwarding with `setClerkGetToken`.
- Mounts one `<Toaster richColors />`.
- Uses shared `NotFound` as `notFoundComponent`.

Conventional layouts:

- `_app.tsx`: authenticated app shell with sidebar, header, any app-wide scope provider, and Clerk `<Protect>`.
- `_auth.tsx`: unauthenticated auth screens; redirects signed-in users to the post-login route.
- `_base.tsx`: public/landing layout; redirects signed-in users to the post-login route.

Use `<Link>` for internal navigation. Use `<Navigate>` for render-time redirects. Use `Route.useParams()` for route params.

Never edit `src/routeTree.gen.ts`.

## 7. Authentication

Use Clerk only. Do not create custom auth state, JWT storage, refresh-token logic, or manual sign-in forms.

`main.tsx` wraps the app as:

```tsx
<QueryClientProvider client={queryClient}>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ theme: shadcn }} localization={i18n.language === "en-US" ? enUS : arSA}>
        <RouterProvider router={router} />
    </ClerkProvider>
</QueryClientProvider>
```

The app must re-render on `i18n.languageChanged` so Clerk localization updates.

Axios token forwarding:

- `src/services/API.ts` is the only direct axios wrapper.
- `setClerkGetToken(getToken)` stores Clerk's token getter.
- A single axios request interceptor attaches `Authorization: Bearer <token>`.
- Strip auth for known third-party URLs such as presigned S3 URLs.
- Do not call `getToken()` inside individual API functions.

Route gating:

- `_app` uses `useAuth().isLoaded`, `<Protect>`, and `<Navigate to="/signin" replace />`.
- `_auth` and `_base` use `<SignedOut>` and redirect signed-in users.
- Sign-in uses Clerk's `<SignIn />`.
- User menu/sign-out uses Clerk's `<UserButton />`.

User roles and permissions:

- Fetch from the backend via `GET /access/:scopeId` using the `useGetAccess(scopeId)` hook (`src/hooks/access/`). Never read role/permissions from Clerk `publicMetadata`.
- The response is a discriminated union (`AdminAccess | StaffAccess`) typed in `src/services/access/Access.api.ts`. `RoleTypes` lives in `src/lib/enums.ts`.
- Access grant management uses `GET /access/grants/:eventId`, `POST /access/grants/:eventId`, `PATCH /access/grants/:eventId/:clerkId`, and `DELETE /access/grants/:eventId/:clerkId`. Grant rows are `AccessAccount` records keyed by `clerkId`, not `_id`.
- UI gates use `access?.role === RoleTypes.ADMIN || (access?.role === RoleTypes.STAFF && access.permissions?.feature)`. Fail closed when `access` is undefined (loading / 401 / 403).
- Admin-only surfaces such as the access management nav item render only for `RoleTypes.ADMIN`; direct route access still relies on backend authorization and renders `GenericError` on access-query failure.
- Global capabilities not scoped to a single event (e.g. create-event) cannot be gated by this endpoint — render for any signed-in user and let the backend reject.
- Treat client-side gating as UX only; backend authorization is authoritative.

## 8. API and Services

Only `src/services/API.ts` imports axios directly.

`API.ts` exports:

- `GET`
- `POST`
- `PATCH`
- `PUT`
- `DELETE`
- `setClerkGetToken`

Normalize service errors in `API.ts` into `Error` objects. Components and hooks should consume normalized errors and never catch Axios directly.

Each feature service uses:

```ts
const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/resource` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/resource`;
```

API files:

- Export the entity response type.
- Export async network functions.
- Return parsed response data.
- Keep upload helper functions private at the bottom of the file.
- Creates accept an `idempotencyKey` and forward it as the `Idempotency-Key` header only when the backend endpoint supports idempotency. Current idempotent resource creates include events, exclusives, feedback, participants, and workshops. Access grants and other endpoints without an idempotency contract use plain `API.POST`.
- Bulk actions send `{ targets: ids }`.

File uploads:

- Request a presigned URL with `API.POST`.
- Upload the `File` with `API.PUT`.
- Store or return the resulting public URL.
- Keep this logic in the `.api.ts` file, not in form components.

## 9. TanStack Query

All backend data belongs to TanStack Query. Do not mirror server data into local state.

Global query defaults:

- `staleTime: 3 * 60 * 1000`
- `refetchInterval: 5 * 60 * 1000`

Read hooks:

- Live in `src/hooks/<feature>`.
- Wrap one `useQuery`.
- Import API calls with an `API` suffix alias.
- Rename `data` to the resource name.
- Rename `isPending` to `loading`.
- Return `{ resource, loading, isError }`.
- Use `retry: false`.
- Use `placeholderData: keepPreviousData` for lists.
- Use `select: (data) => data?.reverse()` when newest-first lists are needed.

Mutation hooks:

- Creates use `useIdempotentMutation` when the service function accepts an idempotency key and forwards the `Idempotency-Key` header.
- Creates without a backend idempotency contract, including `useGrantAccess`, use plain `useMutation` while keeping the standard mutation lifecycle.
- Updates and deletes use `useMutation`.
- Accept `successCallBack?: () => void`.
- Mutation arguments are one object for multi-value mutations.
- Return the action mutate function plus `loading`, `isError`, and `success` when needed.
- Always implement `onSuccess`, `onError`, and `onSettled`.
- Invalidate every related query key: list, detail, stats, and parent resources.
- Use `toast.success(t(response || "<success-key>"), { duration: 5000 })`.
- Use `toast.error(t(error.message || "something-went-wrong-please-try-again-later"))`.
- Call mutation `reset()` in `onSettled`.

Query keys:

- Arrays only.
- Start with a stable kebab-case resource name.
- Append ids after the resource name.
- Examples: `["resources"]`, `["user-resources"]`, `["items", scopeId]`, `["items-stats", scopeId]`.

Do not use optimistic updates unless explicitly approved.

## 10. Forms

Use React Hook Form + Zod for every form.

Each form schema exports:

- `<Feature>Schema`
- `<Feature>SchemaType`
- `<Feature>SchemaInitData`

Zod error strings must be i18n keys, not literal English.

Form setup:

```tsx
const form = useForm<FeatureSchemaType>({
    resolver: zodResolver(FeatureSchema),
    defaultValues: FeatureSchemaInitData
});
```

Add `shouldUnregister: true` for conditionally rendered fields.

Render fields with `<Controller>` and shadcn `Field` primitives. Do not use `register` directly.

Each field includes:

- `Field`
- `FieldLabel`
- `FieldDescription`
- `FieldError`
- `data-invalid` on `Field`
- `aria-invalid` on the control
- `disabled={loading}` during mutations
- input id in `<feature>-<field>` kebab-case format

Use explicit `value` / `onValueChange` for `Select`, `Switch`, `Calendar`, `Popover`, `Command`, and other controlled primitives.

Submit buttons:

- Create: `disabled={loading || !form.formState.isValid}`
- Update: `disabled={loading || !form.formState.isValid || !form.formState.isDirty}`

Dialog forms:

- Reset create forms on `DialogContent onCloseAutoFocus`.
- Hydrate update forms with `useEffect(() => { if (data) form.reset(data, { keepDefaultValues: false }); }, [data, form])`.
- Do not reset forms on `onOpenChange`.

Dynamic forms:

- Use `ZodSchemaCreator`.
- Use `ZodSchemaDefaultValues`.
- Render through shared `FormFieldsDynamicField`.
- Do not create dynamic-form infrastructure unless the project needs metadata-driven fields.

## 11. Tables

Use TanStack Table for list views with filtering, sorting, selection, pagination, or export. It can also be used headlessly for filtered card/grid collections when the UI is not a literal table, as the access and feedback/workshop collection views do.

Standard table files:

```txt
<Feature>Table.tsx
<Feature>TableMain.tsx
<Feature>TableColumnDefs.tsx
<Feature>TableActionCell.tsx
<Feature>TableSearch.tsx
<Feature>TableFilter.tsx
<Feature>TableVisibility.tsx
<Feature>TableExport.tsx
<Feature>TablePagination.tsx
<Feature>TableDelete.tsx
<Feature>TableResetSelection.tsx
```

Omit files that are not needed. Card-backed collections may add a `<Feature>Card.tsx` and omit action-cell, visibility, pagination, selection, delete, reset, and export files when the UI does not use those capabilities.

`<Feature>Table.tsx` owns:

- query hook call
- `columnFilters`
- `columnVisibility` when visibility controls exist
- `rowSelection` when selection or bulk actions exist
- `useReactTable`
- toolbar composition
- table wrapper or card/grid wrapper
- pagination when the UX exposes pagination

Required table settings:

- `pageSize: 20`
- `autoResetPageIndex: false`
- `getRowId` using the entity's stable identifier, e.g. `row._id as string` for database entities or `row.clerkId` for access grants
- `getCoreRowModel`
- `getPaginationRowModel` when pagination is enabled
- `getFilteredRowModel`

Show `<TableSkeleton />` while loading table-shaped views. For card/grid collections, use a feature skeleton or inline skeleton layout that matches the real cards.

Column definitions:

- Export a function returning `ColumnDef[]`.
- First column is the select checkbox column when the feature uses row selection.
- Last column is the action cell when row actions render inside a table.
- Use in-file mini components for translated headers.
- Keep cell renderers short. Headless table column defs used only for filtering may contain only accessor columns.

Empty table bodies render `t("no-results")`. Card/grid collections may render a centered feature-specific empty string such as `t("no-access-found")`.

Exports:

- Feature helpers provide `Structure<Feature>ToExport`, `<Feature>CSVExporter`, and `<Feature>JSONExporter`.
- CSV uses PapaParse and a UTF-8 BOM.
- Filenames use `${feature}_${Date.now()}.csv` or `.json`.

## 12. State Management

Use exactly three state locations:

Server state:

- TanStack Query only.

Cross-feature client state:

- React context in `src/contexts/<thing>-provider.tsx`.
- Use only for state shared across unrelated features, such as theme or a selected workspace/project/organization/scope.
- Persist to `localStorage` inside the provider only.
- Export `<Thing>Provider` and `use<Thing>` / `useSelected<Thing>`.
- Context hooks throw if used outside the provider.
- Selected scope uses toggle-off behavior: selecting the same id clears it.

Component-local state:

- `useState` / `useReducer` for UI-only state.
- Dialog open state, tabs, filters, row selection, and column visibility stay local.

Do not store derived state. Compute it during render or with `useMemo`.

Do not fetch data with `useEffect`.

Do not store auth tokens, sensitive responses, or unbounded data in `localStorage`.

## 13. Styling and UI

Use Tailwind CSS 4 inline utilities only.

Global CSS rules:

- `src/index.css` is the only global stylesheet.
- It owns Tailwind imports, `@theme`, CSS variables, base layer, font, and unavoidable global overrides.
- Do not add CSS modules, SCSS, styled-components, emotion, or new CSS files.

Use `cn()` from `@/lib/utils` for conditional class composition.

Use shadcn/ui primitives from `@/components/ui/...`. Do not edit `src/components/ui/**` manually. Add primitives with `npx shadcn@latest add <name>`.

Use lucide-react icons only. Import icons individually and size with Tailwind classes like `size-4`, `size-5`, `size-8`.

App layout patterns:

- Page wrapper: `flex flex-1 flex-col gap-4 p-4`.
- Page header: `flex flex-wrap items-center justify-between gap-4`.
- Page title: `text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl`.
- Table wrapper: `overflow-hidden rounded-md border`.
- Stat grid: `grid grid-cols-1 divide-y rounded-md border md:grid-cols-N md:divide-x md:divide-y-0`.

RTL rules:

- English is `en-US` and LTR.
- Arabic is `ar-SA` and RTL.
- `i18n.ts` sets `<html lang>` and `<html dir>`.
- `DirectionProvider` receives the active direction at root.
- Use logical Tailwind properties: `ms-*`, `me-*`, `ps-*`, `pe-*`, `border-s`, `border-e`.
- Use `rtl:` / `ltr:` variants when needed.
- Sidebar side flips by language.

Theme:

- Use `ThemeProvider` from `contexts/theme-provider`.
- Store theme in `localStorage` under `vite-ui-theme`.
- Default app theme is light unless explicitly changed.

## 14. Loading, Empty, Error, and Toast States

Use early returns in this order:

```tsx
if (!selectedScope) return <NoScopeSelected />;
if (loadingA || loadingB) return <FeatureSkeleton />;
if (isError) return <GenericError />;
return <Content />;
```

Empty states:

- Live in `components/empty-states`.
- Use shadcn `Empty` primitives.
- Names: `No<Thing>Found`, `No<Thing>Selected`, `GenericError`, `NotFound`, `ErrorComponent`.
- Page-level empty states center the `Empty` component.

Loading:

- Page and section loading uses skeletons from `components/skeleton`.
- Literal table views use `TableSkeleton`; card/grid collections use a feature skeleton or local skeleton layout that matches the real cards.
- Full auth-loading pages use `SpinnerPage`.
- Inline action loading may use the existing shadcn `Spinner` from `@/components/ui/spinner` or the established local button spinner pattern.

Errors:

- Router errors use `ErrorComponent`.
- Section/query errors use `GenericError`.
- Do not display raw API error text in page empty states.

Toasts:

- Mount one `<Toaster richColors />` at root.
- Use sonner only inside mutation hooks.
- Do not toast read/query errors.

## 15. Internationalization

Supported locales:

- `en-US`
- `ar-SA`

Files:

- `src/locales/en.json`
- `src/locales/ar.json`
- `src/locales/i18n.ts`

Rules:

- Translation files are flat JSON objects.
- Keys are kebab-case.
- Add every key to both languages in the same change.
- Keep keys alphabetically sorted.
- Do not nest translation objects.
- Reuse keys when the same value is used in multiple contexts.
- Breadcrumb labels use route segment names directly as keys.
- Zod validation errors are translation keys.
- Backend response strings are translation keys.
- Do not internationalize image `alt` text just for translation coverage.

Common suffixes:

- `-q` for questions.
- `-dots` for placeholders ending with ellipsis.
- `-description` for helper text.
- `-suffix` for inline heading suffixes.

## 16. Tooling and Environment

Use npm only.

Scripts:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

TypeScript:

- Strict mode stays enabled.
- Do not relax unused checks or compiler strictness.
- Keep `@/*` mapped to `./src/*` with explicit `paths` entries.
- Do not add `compilerOptions.baseUrl`; TypeScript 6 deprecates it and TypeScript 7 removes it.

ESLint:

- Flat config.
- Ignore `dist` and `src/components/ui/**`.
- Unused variables are allowed only with `_` prefix.
- Do not add ESLint plugins without approval.

Environment variables:

- Use Vite `VITE_*` variables.
- Read through `import.meta.env`.
- Common variables:
    - `VITE_ENV`
    - `VITE_BE_ENDPOINT`
    - `VITE_CLERK_PUBLISHABLE_KEY`

Do not introduce runtime config layers, feature-flag systems, telemetry, or analytics SDKs without approval.

## 17. Feature Creation Checklist

For a new CRUD feature, create only the files the feature needs:

```txt
src/services/<feature>/<Feature>.api.ts
src/services/<feature>/<Feature>.schemas.ts
src/services/<feature>/<Feature>.helpers.ts

src/hooks/<feature>/useGetAll<Feature>.ts
src/hooks/<feature>/use<Feature>ById.ts
src/hooks/<feature>/useCreate<Feature>.ts
src/hooks/<feature>/useUpdate<Feature>.ts
src/hooks/<feature>/useDelete<Feature>.ts

src/components/<feature>/Create<Feature>Dialog.tsx
src/components/<feature>/Update<Feature>Dialog.tsx
src/components/<feature>/<Feature>Table.tsx
```

Then:

- Add routes under the correct layout.
- Add skeleton and empty states if the page needs them.
- Add translation keys in both locale files.
- Add enum-like values to `src/lib/enums.ts` if they are project-wide.
- Use Query hooks from components, never API calls directly.
- Verify with `npm run lint` and `npm run build`.

## 18. Hard Do-Not-Do List

Do not:

- Edit `src/components/ui/**`.
- Edit `src/routeTree.gen.ts`.
- Import axios outside `src/services/API.ts`.
- Fetch with `useEffect`.
- Mirror Query data into local state.
- Add new dependencies silently.
- Add a second state library.
- Add custom auth flows.
- Store tokens in browser storage.
- Add CSS files or CSS-in-JS.
- Use another icon library.
- Use internal `<a href>` navigation.
- Add generic abstractions before there is real duplication.
- Create compatibility shims, TODO placeholders, or feature flags unless requested.
- Reformat unrelated files.
- Change API contracts, schemas, hook return shapes, or folder structure without clear need.
