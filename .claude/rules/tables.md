# Data tables and table-powered collections (TanStack Table)

Every list view that needs filtering, sorting, selection, or export uses **`@tanstack/react-table`**. Literal data tables follow the full table decomposition. Card/grid collections can use TanStack Table headlessly for filtering and row modeling while rendering cards instead of `<Table>` primitives.

## 1 — File decomposition per table

For a feature `widgets`, expect under `src/components/widgets/`:

```
WidgetsTable.tsx                # composer: wires hooks, table instance, header row, body, pagination
WidgetsTableMain.tsx            # the <Table>/<TableHeader>/<TableBody> primitive wrapper
WidgetsTableColumnDefs.tsx      # ColumnDef<...>[] + co-located translated header / cell mini-components
WidgetsTableActionCell.tsx      # row-actions menu (view, edit, delete, etc.)
WidgetsTableSearch.tsx          # search input bound to a column filter
WidgetsTableFilter.tsx          # filter dropdown for one or more columns
WidgetsTableVisibility.tsx      # column visibility toggle
WidgetsTableExport.tsx          # CSV / JSON export
WidgetsTablePagination.tsx      # page-size + paging controls
WidgetsTableDelete.tsx          # bulk-delete (only mounted when rows are selected)
WidgetsTableResetSelection.tsx  # clear-selection button
```

If a feature doesn't need every file (no export, no filter, no bulk-delete), **omit those files**. Don't create empty stubs.

Card-backed collections may add a `<Feature>Card.tsx` and omit table-only pieces such as action cells, visibility, pagination, selection, delete, reset, and export controls when the UI does not expose those capabilities. Access grants currently use `AccessTable`, `AccessTableMain`, `AccessTableColumnDefs`, `AccessTableSearch`, and `AccessCard`.

## 2 — `WidgetsTable.tsx` skeleton

```tsx
function WidgetsTable({ scopeId }: WidgetsTableProps) {
    const { widgets, loading } = useGetAllWidgets(scopeId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const columns = useMemo(() => {
        if (!widgets || !widgets.length) return [];
        return WidgetsTableColumnDefs(scopeId);
    }, [widgets, scopeId]);

    const table = useReactTable({
        data: widgets || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
        state: { columnFilters, columnVisibility, rowSelection },
        autoResetPageIndex: false,
        getRowId: (row) => row._id as string
    });

    if (loading) return <TableSkeleton />;

    const isRowSelected = Object.keys(rowSelection).length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <WidgetsTableSearch table={table} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <WidgetsTableFilter table={table} />
                    <WidgetsTableVisibility table={table} />
                    <WidgetsTableExport table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <WidgetsTableDelete scopeId={scopeId} table={table} />
                            <WidgetsTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateWidgetDialog scopeId={scopeId} />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <WidgetsTableMain table={table} />
            </div>
            <WidgetsTablePagination table={table} />
        </div>
    );
}
```

Hard rules:

- `pageSize: 20` is the standard default.
- `autoResetPageIndex: false` is the standard — preserve page on filter changes.
- `getRowId` must use the entity's stable id field, e.g. `row._id as string` for database entities or `row.clerkId` for access grants.
- The bulk-action buttons (`Delete`, `ResetSelection`) are mounted **only when** `rowSelection` is non-empty, wrapped in a `<Fragment>`.
- The `<Create...>` dialog/button is the **last** child of the `<ButtonGroup>`.

For headless card/grid collections:

- Keep `columnFilters` and the row models needed for the UX; omit `columnVisibility`, `rowSelection`, and pagination state when there are no controls for them.
- `ColumnDef[]` can be accessor-only when columns exist only for searching/filtering.
- Render `table.getFilteredRowModel().rows` into cards in `<Feature>TableMain`.
- Use a card/grid skeleton that matches the real layout instead of `<TableSkeleton />`.
- Empty state can be a centered feature-specific key such as `t("no-access-found")`.

## 3 — Column definitions (`WidgetsTableColumnDefs.tsx`)

- Export a function that returns the `ColumnDef[]` so id-scoped values (scope ids, parent ids) close over correctly.
- The first column is a `select` checkbox column (`enableSorting: false`, `enableHiding: false`) when the feature uses row selection.
- The last column is the action cell, appended via `columns.push(FormatActionsHeaderAndCell(...))`, when row actions render inside a table.
- For translated headers, define a small in-file component (e.g. `TranslatedHeader`) instead of calling `useTranslation()` inside the cell render — `header: () => <TranslatedHeader header="name" />`.
- Cell renderers are kept short. Wrap inline content in `<Badge>`, `<Avatar>`, or simple `<div>` with utility classes (`w-max max-w-56 truncate ...`).

## 4 — Empty body

`WidgetsTableMain.tsx` must render a `t("no-results")` row when `table.getRowModel().rows?.length === 0`:

```tsx
{
    isEmpty && (
        <TableRow>
            <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                {t("no-results")}
            </TableCell>
        </TableRow>
    );
}
```

For card/grid collection mains, render a centered empty message with the feature key that matches the UI, e.g. `t("no-access-found")`.

## 5 — CSV / JSON export

- Live in `<Feature>.helpers.ts`, three functions: `Structure<Feature>ToExport(rows)`, `<Feature>CSVExporter(headers, data)`, `<Feature>JSONExporter(data)`. Names are PascalCase by precedent.
- The CSV exporter uses **PapaParse** with a UTF-8 BOM (`"﻿"`) prepended — required for non-ASCII columns (Arabic, Chinese, accented Latin, etc.) to render correctly in Excel:
    ```ts
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    ```
- Filenames use `${feature}_${Date.now()}.csv` / `.json`.
- The export button in the table is a `<DropdownMenu>` with `csv` / `json` items.

## 6 — Bulk delete

- The bulk-delete component takes `{ scopeId, ..., table }` props.
- It calls `useDelete<Feature>` with ids from the entity's stable id field, e.g. `<feature>Ids: table.getFilteredSelectedRowModel().flatRows.map((r) => r.original._id)` for database entities.
- After success it should reset selection: `table.toggleAllRowsSelected(false)` (or simply rely on cache invalidation; mirror local precedent).

## 7 — Don't do

- Don't compose literal data tables outside this decomposition for the sake of brevity. Even a small table follows the pattern, while card/grid collections use the headless subset described above.
- Don't wire pagination with custom hooks when `getPaginationRowModel()` already covers it.
- Don't bypass loading skeletons. Use `<TableSkeleton />` for literal table views and a matching feature/card skeleton for card or grid collections.
- Don't add server-side filtering/pagination unless the dataset is large enough to require it. Default to client-side.
