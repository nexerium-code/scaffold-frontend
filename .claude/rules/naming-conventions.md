# Naming conventions

Names are how the codebase stays IDE-searchable. Follow these literally.

## 1 — Components

| Aspect               | Rule                                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| File name            | **PascalCase.tsx** (`UserCard.tsx`, `CreateWidgetDialog.tsx`)                                                                                     |
| Component identifier | Same **PascalCase** as file (`function UserCard() { … }`)                                                                                         |
| Props shape          | Define **`type`**, never `interface` (no third-party-extension exceptions in normal application code)                                             |
| Props naming         | Must match component + `Props` suffix (`UserCardProps`)                                                                                           |
| Export               | **Default export** at the bottom of the file (`export default UserCard;`). Co-located helper components stay as named functions in the same file. |

Group prefixes used for components:

- `App*` for global chrome (`AppHeader`, `AppSidebar`, `AppLanguageSwitcher`, etc.).
- `Create<Resource>Dialog` / `Update<Resource>Dialog` / `View<Resource>Sheet` for resource modals.
- `<Feature>Table` for the table or headless collection composer; `<Feature>Table<Aspect>` for its sub-pieces (`<Feature>TableMain`, `<Feature>TableColumnDefs`, `<Feature>TableSearch`, `<Feature>TableFilter`, `<Feature>TableVisibility`, `<Feature>TableExport`, `<Feature>TablePagination`, `<Feature>TableActionCell`, `<Feature>TableDelete`, `<Feature>TableResetSelection`) and `<Feature>Card` for card-backed collection rows.
- `<Feature>Skeleton` for skeletons under `components/skeleton/`.
- `No<Thing>Found` / `No<Thing>Selected` / `GenericError` / `NotFound` for empty states under `components/empty-states/`.

## 2 — Hooks

- File and function start with **`use`** followed by PascalCase: `useCreateWidget.ts → export function useCreateWidget() { … }`.
- Verb-first for mutations: `useCreate<Resource>`, `useUpdate<Resource>`, `useDelete<Resource>`, `useUpdate<Resource><Aspect>` (e.g. for narrow status patches).
- Read-side patterns:
    - `useGetAll<Resource>` for unscoped lists.
    - `use<Resource>ById` for single-entity fetches.
    - `useUser<Resource>(s)` when scoped to the current user/session/parent id.
    - `useGet<Resource>Stats` for stat aggregations.
- Generic root-level hooks may use `kebab-case` only when they come from shadcn (`use-mobile.ts`); for everything else use `useCamelCase.ts`.

## 3 — Helpers (`src/lib/`)

| Category                            | File / function                                                                                            | Export                                            |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Stand-alone heavy helper            | **PascalCase.ts** + **PascalCase function** (`ZodSchemaCreator.ts → ZodSchemaCreator`)                     | `default` if only one helper, `named` if multiple |
| Several related small helpers       | **PascalCase.ts** + **PascalCase functions** (`ZodSchemaDefaultValues.ts → ZodSchemaDefaultValues`)        | named                                             |
| Tiny utilities                      | **`utils.ts`** + **camelCase functions** (`cn`, `capitalizeFirstLetter`, `toYMD`, date helpers, etc.)      | named                                             |
| Project-wide enums / discriminators | **`enums.ts`** — `<Plural>Types` (`as const` record) + `<Singular>Type` alias (`WidgetTypes` + `WidgetType`) | named                                             |

## 4 — Routes (`src/routes/`)

- TanStack file-system rules:
    - Static segments → **kebab-case** (e.g. `dashboard.tsx`, `signin.tsx`).
    - Dynamic segments → `$param.tsx` (e.g. `$widgetId.tsx`).
    - Folder index → `index.tsx`.
    - Layout / pathless wrapper → `_<name>.tsx` (`_app.tsx`, `_auth.tsx`, `_base.tsx`).
- Route component identifiers are **PascalCase**. When the page name is generic, `RouteComponent` is the accepted default identifier.

## 5 — Services (`src/services/<feature>/`)

| File                   | Entity                          | Naming                                                                                                 | Export |
| ---------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------ | ------ |
| `<Feature>.api.ts`     | Network call functions          | **camelCase** (`getAllWidgets`, `createWidget`, `updateWidget`, `deleteWidget`, `broadcastWidget`)     | named  |
| `<Feature>.api.ts`     | Entity TS type                  | **PascalCase**, singular (`Widget`, `User`, `Order`)                                                   | named  |
| `<Feature>.api.ts`     | Endpoint constant               | `ENDPOINT` (uppercase, file-local; never exported)                                                     | local  |
| `<Feature>.schemas.ts` | Zod schema                      | **PascalCase** + `Schema` (`WidgetSchema`, `WidgetMainSchema`)                                         | named  |
| `<Feature>.schemas.ts` | Inferred TS type                | Schema name + `Type` (`WidgetSchemaType`)                                                              | named  |
| `<Feature>.schemas.ts` | Default form values             | Schema name + `InitData` (`WidgetSchemaInitData`)                                                      | named  |
| `<Feature>.helpers.ts` | Exporters / transformers        | **PascalCase** (`Structure<Feature>ToExport`, `<Feature>CSVExporter`, `<Feature>JSONExporter`)         | named  |
| `<Feature>.helpers.ts` | Plain data prep / status checks | **camelCase** (`prepare<Feature>Data`, `init<Feature>Data`, `get<Feature>Status`)                      | named  |
| `<Feature>` filename   | Service file prefix             | **PascalCase** matching folder feature (`Widgets.api.ts`, `Widgets.schemas.ts`, `Widgets.helpers.ts`)  | —      |

## 6 — Translation keys (`src/locales/*.json`)

- All keys are **flat** and **kebab-case**: `sign-in`, `email-is-required`, `placeholder-widget-name`, `something-went-wrong`.
- Suffixes:
    - `-q` → question (`forgot-password-q`).
    - `-dots` → placeholder ending in "…" (`search-widget-dots`).
    - `-description` → field/help description (`widget-name-description`).
    - `-suffix` → trailing inline italicized label (`widgets-suffix`).
- Singular vs plural by context. Reuse keys when the value is identical across contexts. See `translation.md` for full rules.

## 7 — Constants

- Enum-style records live in `src/lib/enums.ts` as **`as const`** records using **SCREAMING_SNAKE_CASE keys** and human-readable string values:
    ```ts
    export const WidgetTypes = { STANDARD: "Standard", PREMIUM: "Premium" } as const;
    export type WidgetType = (typeof WidgetTypes)[keyof typeof WidgetTypes];
    ```
- Sets used for runtime checks live in the same file with **PascalCase** names (e.g. `MustHaveOptions`, `SearchableTypes`, `FilterableTypes`).
- One-off module constants stay at the top of the file using camelCase or UPPER_CASE depending on local precedent. Don't introduce a `src/constants/` folder unless the project already has one.

## 8 — Query keys

- Always an **array** starting with a stable, kebab-case feature/resource name. Append entity ids as additional elements.
- Example shapes: `["widgets"]`, `["widget"]`, `["widget-stats"]`, `["widgets", parentId]`, `["widget-children", parentId, childId]`.
- Mutations invalidate **every related** key — list-level, detail-level, and any aggregated stats key.
