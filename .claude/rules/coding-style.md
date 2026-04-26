# Coding style & communication charter

These rules apply on every change. They define the baseline expectations; the other `.claude/rules/*.md` files refine each topic.

## 1 — Consistency over cleverness

- The single highest priority is **consistency** with existing code in the repo and especially with files in the same feature folder.
- Before writing or editing code, read 2–3 nearby files in the same feature/layer and **mirror them**: structure, naming, exports, TypeScript patterns, hook/service split, Tailwind class ordering, spacing, comment density, error handling, import order, etc.
- If a written rule and local precedent disagree, prefer the written rule. If the rules are silent, follow local precedent.
- Do not introduce a parallel style. A "cleaner generic alternative" is the wrong call here; matching the surrounding files is the right call.

## 2 — Stack assumptions (do not deviate without approval)

- **Vite + React 19 + TypeScript (strict)**
- **TanStack Router** for routing; **TanStack Query** for server state; **TanStack Table** for data tables
- **React Hook Form + Zod** (schema-first) via `zodResolver`
- **Tailwind CSS 4** inline utility classes only (no CSS modules, no styled-components)
- **shadcn/ui** primitives in `src/components/ui/` — CLI-managed, never edited manually
- **Clerk** for authentication; **Axios** wrapped by a single `src/services/API.ts` module
- **i18next + react-i18next** for translations — English (`en-US`) + Arabic (`ar-SA`)
- **sonner** for toasts; **lucide-react** for icons; **date-fns** (+ `date-fns-tz` when timezones matter)

If the task seems to require a new library, ask first. Do not add a dependency silently.

## 3 — TypeScript

- TypeScript only (`.ts` / `.tsx`). No JavaScript.
- Strict mode is on. `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports` are all enforced.
- Prefer `type` over `interface` for object shapes. Use `interface` only when extending a third-party interface that requires it.
- Imports use the `@/` alias (`@/* → ./src/*`). Never use relative imports that traverse above `src/`. Inside `src/`, prefer `@/...` over relative `./...` for any cross-folder import.
- Prefix intentionally unused identifiers with `_` (matches the eslint config: `varsIgnorePattern`, `argsIgnorePattern`, `caughtErrorsIgnorePattern` all `^_`).

## 4 — React component style

- Components are **`function` declarations**, not arrow functions:
    ```tsx
    function CreateWidgetDialog({ onClose }: CreateWidgetDialogProps) { ... }
    export default CreateWidgetDialog;
    ```
- One component per file. Default-export the component at the bottom of the file (not inline `export default function ...`).
- Props are a `type`, named `<ComponentName>Props`, declared above the component:
    ```tsx
    type CreateWidgetDialogProps = { onClose: () => void };
    ```
- Co-located internal helper components (e.g. a `TranslatedHeader` used only by a column-defs file) stay in the same file as named functions, **after** the main export.
- Don't wrap with `React.memo`, `forwardRef`, or HOCs unless local precedent already does — it generally doesn't.
- Avoid `useEffect` for derived state; use `useMemo` / direct rendering. The two acceptable `useEffect` use-cases are: hydrating a form on data load (`form.reset(data, { keepDefaultValues: false })`) and global keyboard / DOM listeners.

## 5 — Imports & ordering

Code is consistently organized as:

1. External packages (grouped together).
2. A blank line.
3. Internal `@/` imports (grouped together).

Example:

```ts
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { useCreateWidget } from "@/hooks/widgets/useCreateWidget";
import { WidgetSchema } from "@/services/widgets/Widgets.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
```

Don't reorder existing imports gratuitously.

## 6 — Comments

- Default to **no comments**. Code is self-documenting via good names and small files.
- Add a comment only when it explains a non-obvious _why_: a hidden invariant, an external contract, a workaround. Never comment what the code already says.
- Multi-line JSDoc-style block comments are reserved for genuinely complex utilities (e.g. an idempotency-key wrapper, a shared retry policy). Don't write them for ordinary components/hooks.
- Match the comment density of the surrounding files. If the file has no comments, don't add any.

## 7 — Formatting (Prettier)

- 4-space indentation, semicolons, double quotes, no trailing commas, `arrowParens: "always"`, `printWidth: 360` (very wide; do not artificially line-break to look "narrow").
- `prettier-plugin-tailwindcss` runs automatically — do not hand-sort Tailwind classes; let the plugin order them. Configure `tailwindFunctions` for any tagged-template helper used as a class-name carrier.

## 8 — Error handling

- Network errors are normalized inside `src/services/API.ts` (returns `new Error(error?.response?.data?.message)`). Components never `try/catch` Axios calls directly; they consume hooks.
- Mutation hooks always set `onError` to `toast.error(t(error.message ?? "<fallback-i18n-key>"))`. The fallback key must exist in both `en.json` and `ar.json`.
- Throwing inside a context to enforce provider usage is the standard pattern (`if (context === undefined) throw new Error(...)`).

## 9 — Autofix vs. ask

- Trivial lint/format issues, missing translation keys, and obvious typos: fix silently.
- Anything affecting API contracts, schema shapes, hook return shapes, folder structure, or new dependencies: **ask before changing.**

## 10 — Don't do

- Don't add files to `src/components/ui/`. Use the shadcn CLI.
- Don't bypass `src/services/API.ts` by importing axios directly into components.
- Don't add backwards-compatibility shims, dead-code "TODO: remove" markers, or feature flags unless the task is explicitly about that.
- Don't internationalize `alt` text, `aria-label`s that are debug-only, or `console.*` strings.
- Don't introduce CSS files, styled-components, emotion, or any non-Tailwind styling layer.
