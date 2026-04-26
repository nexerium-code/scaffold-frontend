# Project structure rules

How files and folders **must** be organised. The shape applies to any frontend repo using this stack.

## 0 — Global

- **Language** — TypeScript only (`.ts` / `.tsx`).
- **Imports** — Use the absolute alias (`@/* → ./src/*`) defined in `tsconfig.app.json`. Never traverse above `src/`. Inside `src/`, prefer `@/...` over relative paths for any cross-folder import.
- **File naming**
    - Components → `PascalCase.tsx` (one component per file).
    - Hooks → `use<PascalCase>.ts` (e.g. `useCreateWidget.ts`, `useGetAllWidgets.ts`). One hook per file.
    - Contexts → `kebab-case-provider.tsx` (e.g. `theme-provider.tsx`).
    - Routes → TanStack file-system rules (kebab-case static segments, `$param.tsx`, `_layout.tsx`).
    - Services → `<Feature>.<area>.ts` with **PascalCase** prefix matching the folder feature (e.g. `Widgets.api.ts`, `Widgets.schemas.ts`, `Widgets.helpers.ts`). PascalCase is the default; lowercase prefixes only appear in early-stage / single-call files and shouldn't be a model for new work.
    - Lib helpers → `PascalCase.ts` for stand-alone helpers; add to `lib/utils.ts` for small utilities.
- **Exports**
    - Components → **default export** at the bottom of the file.
    - Hooks, services, schemas, helpers, contexts → **named exports**.
- **Styles** — Tailwind CSS classes inline only. No CSS files. Global styles live exclusively in `src/index.css`.

## 1 — `src/components/`

- **One folder per feature.** Feature folders mirror service/hook feature folders (1:1 with backend resources).
- UI must not import across feature folders directly. If two features need the same component, lift it into `general/`.
- **`_app/`** — global layout chrome (header, sidebar, language/theme switchers, global menus). Components here are conventionally prefixed `App` (`AppHeader`, `AppSidebar`, `AppLanguageSwitcher`, etc.).
- **`general/`** — purely generic, reusable UI that is feature-agnostic (`CopyInput`, `ProfilePic`, `SpinnerPage`, etc.).
- **`empty-states/`** — full-page or section empty/error fallbacks built on the shadcn `<Empty>` primitive (`No<Thing>Found`, `No<Thing>Selected`, `GenericError`, `NotFound`, `ErrorComponent`).
- **`skeleton/`** — page-/section-level skeletons matching real layouts (`<Feature>Skeleton`, `TableSkeleton`).
- **`ui/`** — shadcn/ui primitives. **CLI-managed; never edited manually.** ESLint ignores this directory.
- **`form-fields/`** — only created when the project needs dynamic Zod-driven inputs (forms whose fields come from runtime metadata). Skip this folder if forms are all statically defined.
- **`landing/`** — only when the project ships a marketing/landing surface used from a public layout route. Skip otherwise.

## 2 — `src/contexts/`

- One file per context, named `<thing>-provider.tsx` (kebab-case).
- Each file exposes:
    - `<Thing>Provider` (component, named export).
    - `use<Thing>()` hook (named export). The hook throws if the context is missing/undefined.
- Hold only **cross-feature** state (auth, theme, currently-selected scope id, etc.). Feature-local state stays in the feature.

## 3 — `src/hooks/`

- **A folder = a feature**, mirroring `src/services/` and `src/components/`.
- Files inside follow `use<Action><Resource>.ts`:
    - Reads → `useGetAll<Resource>`, `use<Resource>ById`, `useUser<Resource>` (when scoped to the current user/session), `useGet<Resource>Stats` (for aggregates).
    - Writes → `useCreate<Resource>`, `useUpdate<Resource>`, `useDelete<Resource>`, `useUpdate<Resource><Aspect>` for narrow patches.
- Non-feature, generic hooks live at the **root** of `src/hooks/` (e.g. `useBreadCrumbs.ts`, `useIdempotentMutation.ts`, plus shadcn-generated `use-mobile.ts`).
- Each hook wraps a single TanStack Query `useQuery` or `useMutation`. See `feature-workflow.md` for the full pattern.

## 4 — `src/lib/`

- Flat collection of **pure, framework-agnostic** helpers.
- Large helpers → their own file, **PascalCase**, e.g. `ZodSchemaCreator.ts`. Default-export when the file exposes exactly one helper, named-export when more than one.
- Tiny utilities → add to `utils.ts` as **camelCase named exports** (`cn`, `capitalizeFirstLetter`, date utilities, etc.).
- `enums.ts` holds **all** project-wide enum-like objects (`as const` records) and their derived `type X = (typeof Xs)[keyof typeof Xs]` aliases. New enums go here, not in feature folders.

## 5 — `src/locales/`

- Exactly two flat JSON files: `en.json` (English, `en-US`) and `ar.json` (Arabic, `ar-SA`).
- Plus `i18n.ts` for the i18next initialization (LanguageDetector, fallback, `<html lang>` / `<html dir>` side-effects on language change).
- Keys are flat (no nesting) and `kebab-case`. See `translation.md`.

## 6 — `src/routes/`

- File-system routing via **@tanstack/react-router** with `autoCodeSplitting: true`.
- Auto-generated `routeTree.gen.ts` lives next to `main.tsx`. Never edit it manually.
- Layout files use the leading-underscore "pathless route" convention. Conventional set:
    - `__root.tsx` — true root, sets up providers (theme, toaster, tooltip, RTL/direction) and registers the auth-token bridge.
    - `_app.tsx` + `_app/` — authenticated app shell (sidebar + header + outlet, gated by Clerk `<Protect>`).
    - `_auth.tsx` + `_auth/` — unauthenticated auth screens.
    - `_base.tsx` + `_base/` — unauthenticated public/marketing layout (skip if the project has none).
- Param segments use `$paramName.tsx`.
- The index of a folder uses `index.tsx`.
- Route components are `function` declarations named after the page or the generic `RouteComponent`. The export is `export const Route = createFileRoute(...)({ component: ... })`.

## 7 — `src/services/`

- `API.ts` is the **only** place axios is imported directly. It exports a default object with typed `GET`/`POST`/`PATCH`/`PUT`/`DELETE` methods plus the `setClerkGetToken` initializer.
- **Folder per feature.** Folder name is lowercase (`widgets/`, `users/`, `orders/`).
- Inside each folder, file naming is **`<Feature>.<area>.ts`** with PascalCase prefix:
    - `<Feature>.api.ts` — async network calls + the entity `type` declaration + a single top-of-file `ENDPOINT` constant. Function names are camelCase. Helper inner functions (e.g. for presigned-URL uploads) stay at the bottom of the file as non-exported helpers.
    - `<Feature>.schemas.ts` — Zod schemas (`<Feature>Schema`), inferred types (`<Feature>SchemaType`), and an init-data const (`<Feature>SchemaInitData`). All named exports.
    - `<Feature>.helpers.ts` — pure feature-specific utilities. Function names follow local precedent (PascalCase for exporters/transformers, camelCase for plain data prep).
- Larger features split schemas into multiple files (`<Feature>.main.schemas.ts`, `<Feature>.<aspect>.schemas.ts`, plus an aggregator `<Feature>.schemas.ts`). Apply this when a single schema file would exceed ~150 lines.

## 8 — `src/index.css` and `src/main.tsx`

- `src/index.css` is the only place global Tailwind directives, CSS variables, and base font / `@theme` config live.
- `src/main.tsx` mounts the app, creates the `QueryClient` and `Router`, wraps with `<ClerkProvider>`, and re-renders on `i18n.languageChanged` so Clerk's localization stays in sync.

## Do not modify

- **Never modify** `src/components/ui/` — shadcn/ui components are managed by the CLI; do not edit them manually.
- **Never modify** `src/routeTree.gen.ts` — auto-generated by the TanStack Router Vite plugin.
