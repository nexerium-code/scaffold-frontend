# State management

There are exactly three places state lives in this stack. Pick the right one for what you're storing.

## 1 — Server state → TanStack Query

All data that comes from the backend is owned by **TanStack Query**. Never mirror it into local state.

- Reads: `useQuery` inside a hook under `src/hooks/<feature>/use<Resource>...ts`. Components consume the hook.
- Writes: `useMutation` inside a hook in the same folder. Use `useIdempotentMutation` for creates only when the service function and backend endpoint support `Idempotency-Key`. See `feature-workflow.md`.
- Defaults are set globally in `src/main.tsx`:
    ```ts
    new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 3 * 60 * 1000,
                refetchInterval: 5 * 60 * 1000
            }
        }
    });
    ```
    **Don't override these per-hook unless you have a specific reason** (e.g. an inherently real-time chart). Per-hook overrides used in this stack: `placeholderData: keepPreviousData` for lists, `retry: false` everywhere, `select: (data) => data?.reverse()` for reverse-chronological lists.
- Query keys live in arrays starting with the kebab-case resource (`["widgets"]`, `["widget-children", parentId, childId]`). Mutations invalidate **every** related key — list, detail, and any aggregated stats key.

## 2 — Cross-feature client state → React contexts

Use a **context** in `src/contexts/<thing>-provider.tsx` only when state needs to be shared across multiple unrelated features. Typical cases:

- A theme provider for light/dark mode (persisted to `localStorage`).
- A "currently selected scope" provider (e.g. organization id, workspace id, project id) — typically with toggle-off semantics: re-selecting the same id clears it.

Provider conventions:

- Default-state-throwing hook (`if (context === undefined) throw new Error("Context usage prohibited in the current placement")`).
- Persistence to `localStorage` happens **inside** the provider, not the consumer.
- Two named exports per file: `<Thing>Provider` and `use<Thing>` (or `useSelected<Thing>` etc).

Don't reach for a global state library (Redux, Zustand, Jotai). The patterns above cover everything.

## 3 — Component-local state → `useState` / `useReducer`

- Anything UI-only (open/closed, current tab, table column visibility, selection, filter strings) lives in the component that owns it.
- For TanStack Table state, manage `columnFilters`, `columnVisibility`, and `rowSelection` with `useState` and pass them into `useReactTable({ state: { ... } })`. See `tables.md`.
- Use `useMemo` to derive expensive structures (column definitions, lookup maps). Only depend on values that actually change.

## 4 — Where NOT to put state

- **Don't store derived state**. Compute it during render or with `useMemo`.
- **Don't mirror Query data** into `useState`. If you need to transform the data, use `select` on the query, or compute it during render.
- **Don't put feature-local state into a context.** A `Dialog`'s open/close state belongs in the component that owns the trigger.
- **Don't hand-roll fetch logic with `useEffect` + `setState`.** Always go through `useQuery` / `useMutation`.

## 5 — `localStorage` usage

- Keys typically used in this stack: a theme key (e.g. `vite-ui-theme`), a scope-selection key, plus `i18nextLng` (managed by `i18next-browser-languagedetector`).
- When persisting a new piece of state, prefer hanging it off a context provider (the established pattern). Don't sprinkle direct `localStorage` access across components.
- Never store auth tokens, sensitive API responses, or anything that could grow unbounded.

## 6 — Optimistic updates

- This stack does **not** use optimistic mutations by default. Every mutation invalidates and refetches on success.
- Don't introduce optimistic updates without explicit approval — they couple component code to mutation hooks and complicate rollback.
