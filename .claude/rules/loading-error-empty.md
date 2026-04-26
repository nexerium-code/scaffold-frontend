# Loading, error, and empty states

Every feature must render the same three-state UX. Components live in dedicated folders and use the shadcn primitives — never custom-built fallbacks.

## 1 — Render order at the route / section level

Pages and large sections short-circuit in this exact order:

```tsx
if (!scopeId) return <NoScopeSelected />;             // 1. empty / no-selection state
if (loadingX || loadingY) return <FeatureSkeleton />; // 2. loading state
if (isError) return <GenericError />;                 // 3. error state
return ( /* real content */ );                        // 4. happy path
```

Don't combine these into ternaries inside JSX. Use early returns.

## 2 — Empty / no-data states (`src/components/empty-states/`)

- One `PascalCase.tsx` file per state. File naming: `No<Thing>Found.tsx`, `No<Thing>Selected.tsx`, `GenericError.tsx`, `NotFound.tsx`, `ErrorComponent.tsx`.
- Built on the shadcn `<Empty>` family of primitives:
    ```tsx
    <Empty>
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <Icon />
            </EmptyMedia>
            <EmptyTitle>{t("no-<thing>-selected")}</EmptyTitle>
            <EmptyDescription>{t("no-<thing>-selected-description")}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
            <EmptyDescription>
                {t("need-help-q")} <Link to="/">{t("contact-support")}</Link>
            </EmptyDescription>
        </EmptyContent>
    </Empty>
    ```
- Page-level empty states wrap the `<Empty>` in a centered flex container: `<div className="flex flex-1 items-center justify-center">...</div>`.
- The error/destructive variant tints the icon: `<EmptyMedia className="bg-destructive/20 text-destructive" variant="icon">`.
- Translation keys for empty/error copy follow the conventions in `translation.md` (`no-<thing>-found`, `no-<thing>-selected`, `something-went-wrong`, `unexpected-error-description`, `need-help-q`, `contact-support`).

## 3 — Error fallbacks

- `ErrorComponent.tsx` is the **router-level default** (`defaultErrorComponent` in `main.tsx`) — full-screen, with a "Reload" `<Button>` calling `window.location.reload()`.
- `GenericError.tsx` is the **section-level** error used inside route components when a hook returns `isError` — same primitives, no full-screen wrapper.
- Don't show raw error messages from `error.message` in empty-states — these are i18n keys, but they're already routed to the toast layer by the mutation hooks. The empty-state shows generic copy and a "contact support" link.

## 4 — Loading states (`src/components/skeleton/`)

- One `PascalCase.tsx` skeleton per page or section, named `<Feature>Skeleton.tsx` (plus a generic `TableSkeleton.tsx`, `PlaceholderSkeleton.tsx` etc).
- Built from the shadcn `<Skeleton />` primitive arranged to **match the real layout** (headings, stat grids, tables) so swapping in real content doesn't shift the page.
- Use `<TableSkeleton />` inside any `useReactTable`-driven component while `loading` is true. Don't render a half-loaded table.
- For inline mid-content loading (e.g. button submitting), use a `<Loader2 className="size-4 animate-spin" />` from `lucide-react`.

## 5 — Spinners

- `<SpinnerPage />` from `src/components/general/` is the full-page spinner used by `_app.tsx`, `_auth.tsx`, and `_base.tsx` while Clerk's `useAuth().isLoaded` is false.
- For other "tiny synchronous loading" cases, prefer a skeleton over a spinner.

## 6 — Toasts (sonner)

- Mounted once at root via `<Toaster richColors />` inside `__root.tsx`. Don't mount additional `Toaster` instances.
- Used **only** inside mutation `onSuccess` / `onError` handlers; not inside route components, not inside queries.
- Always pass an i18n key wrapped in `t()`:
    - Success: `toast.success(t(response || "<feature-success-key>"), { duration: 5000 })`.
    - Error: `toast.error(t(error.message || "something-went-wrong-please-try-again-later"))`.

## 7 — Don't do

- Don't roll a custom `<Spinner />` or `<Empty />` — use the existing primitives.
- Don't put loading/error logic inside the components rendered by happy-path content — the route gate handles it.
- Don't render different skeletons for "first load" vs "re-fetch". `placeholderData: keepPreviousData` already keeps last data on screen during refetches.
- Don't show toasts on read errors (`useQuery`); only on mutation errors. Read errors render `<GenericError />` instead.
