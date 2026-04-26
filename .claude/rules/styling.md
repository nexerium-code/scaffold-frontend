# Styling (Tailwind v4 + shadcn/ui + RTL)

## 1 — Tailwind setup

- **Tailwind CSS 4** via `@tailwindcss/vite`. The single global stylesheet is `src/index.css` and it owns all `@theme`, CSS-variable, and base-layer config. Do not create additional CSS files.
- All styles are **inline utility classes** on JSX. No `className={styles.foo}`, no `styled-components`, no emotion, no CSS-in-JS.
- `prettier-plugin-tailwindcss` orders classes automatically. Don't hand-sort. Configure `tailwindFunctions` (e.g. `["tw"]`) for any tagged-template helpers used as class-name carriers.
- `tw-animate-css` is available for short, named keyframe animations.

## 2 — `cn()` helper

Always use `cn()` from `@/lib/utils` for any class composition that involves conditionals or merging:

```tsx
<Button className={cn("text-white", isActive ? "bg-green-700" : "bg-red-700")}>...</Button>
```

`cn` wraps `clsx` + `tailwind-merge`, so it deduplicates conflicting Tailwind utilities. Don't compose with template strings or array `.join(" ")`.

## 3 — shadcn/ui (`src/components/ui/`)

- Configured via `components.json`. Conventional values used in this stack:
    - `style: "radix-vega"` (or whichever style the project picks once), `baseColor: "neutral"`, `cssVariables: true`.
    - `iconLibrary: "lucide"`, `rtl: true` when supporting RTL locales.
    - Aliases: `components` → `@/components`, `ui` → `@/components/ui`, `utils` → `@/lib/utils`, `lib` → `@/lib`, `hooks` → `@/hooks`.
- **Never edit files under `src/components/ui/` manually.** They are CLI-managed. Add primitives via `npx shadcn@latest add <name>`.
- ESLint ignores `src/components/ui/**`.
- When customizing a primitive's appearance, do it on the consumer with utility classes — never by editing the primitive.

The most-used primitives in this stack: `Button`, `ButtonGroup`, `Dialog`, `Sheet`, `DropdownMenu`, `Popover`, `Calendar`, `Input`, `InputGroup`, `Textarea`, `Select`, `Switch`, `Checkbox`, `Field` family, `Empty` family, `Sidebar` family, `Tabs`, `Tooltip`, `Avatar`, `Badge`, `Card`, `Command`, `Separator`, `Table`, `Skeleton`, `Sonner`. Prefer composing these over rolling new primitives.

## 4 — Icons

- **Lucide React** (`lucide-react`) is the only icon set. Import individual icons by name: `import { Mail, Calendar } from "lucide-react"`.
- Icon size is set with Tailwind: typically `size-4`, `size-5`, `size-8`, `size-10` rather than `width={...} height={...}`.
- Place icons inside `<InputGroupAddon>`, `<SidebarMenuButton>` children, table cells, etc., per local pattern.

## 5 — Theming and dark mode

- Theme state lives in `@/contexts/theme-provider`. The provider stores the user's choice in `localStorage` (key conventionally `vite-ui-theme`) and toggles `light`/`dark` classes on `<html>`.
- `defaultTheme="light"` is configured at `__root.tsx`. Don't change without discussion.
- `next-themes` is installed and used by some shadcn primitives; the app-level provider remains `@/contexts/theme-provider`.

## 6 — RTL & internationalization-aware styling

- The two locales are English (`en-US`, LTR) and Arabic (`ar-SA`, RTL). `dir` is toggled on `<html>` by `i18n.ts` and propagated through `<DirectionProvider dir={...}>` from shadcn. Do not set `dir` manually inside components except for special cases like read-only LTR strings inside an Arabic page (e.g. phone numbers, URLs — use `dir="ltr"` on the wrapper).
- Use **logical properties** in Tailwind:
    - Margins/padding: `ms-*`, `me-*`, `ps-*`, `pe-*` (start/end), not `ml-*`, `mr-*`, `pl-*`, `pr-*`.
    - Borders: prefer `border-s`, `border-e` when the side matters semantically.
    - Use `rtl:` and `ltr:` variants when a layout needs to flip differently than the default mirroring (e.g. `rtl:translate-x-0` to neutralize a translation).
- Sidebar `side` flips based on language: `side={i18n.language === "en-US" ? "left" : "right"}`. Mirror this when adding new docked panels.

## 7 — Layout idioms (recurring patterns)

Common page-level patterns — copy them rather than reinventing:

- Page wrapper: `<div className="flex flex-1 flex-col gap-4 p-4">`.
- Page header row: `<div className="flex flex-wrap items-center justify-between gap-4">` with an `<h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">`.
- Inline italicized suffix on a heading: `<span className="text-xl font-light italic">{t("<thing>-suffix")}</span>`.
- Stat grid: `<div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-N md:divide-x md:divide-y-0">` with `<div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">`.
- Table wrapper: `<div className="overflow-hidden rounded-md border">`.

## 8 — Don't do

- Don't add CSS files, SCSS, or PostCSS plugins.
- Don't write inline `style={{ }}` objects unless interpolating runtime values that Tailwind cannot express.
- Don't introduce a second icon set.
- Don't hard-code `ltr`/`rtl`-specific margins; use logical properties.
- Don't import shadcn primitives from anywhere other than `@/components/ui/...`.
