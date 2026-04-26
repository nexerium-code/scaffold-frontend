import { Fragment, useMemo, useState } from "react";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, RowSelectionState, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";

import GenericError from "@/components/empty-states/GenericError";
import CreateResourceDialog from "@/components/resources/CreateResourceDialog";
import { ResourcesTableColumnDefs } from "@/components/resources/ResourcesTableColumnDefs";
import ResourcesTableDelete from "@/components/resources/ResourcesTableDelete";
import ResourcesTableExport from "@/components/resources/ResourcesTableExport";
import ResourcesTableFilter from "@/components/resources/ResourcesTableFilter";
import ResourcesTableMain from "@/components/resources/ResourcesTableMain";
import ResourcesTablePagination from "@/components/resources/ResourcesTablePagination";
import ResourcesTableResetSelection from "@/components/resources/ResourcesTableResetSelection";
import ResourcesTableSearch from "@/components/resources/ResourcesTableSearch";
import ResourcesTableVisibility from "@/components/resources/ResourcesTableVisibility";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { useGetAllResources } from "@/hooks/resources/useGetAllResources";

type ResourcesTableProps = {
    scopeId: string;
};

function ResourcesTable({ scopeId }: ResourcesTableProps) {
    const { resources, loading, isError } = useGetAllResources(scopeId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo(() => ResourcesTableColumnDefs(), []);

    const table = useReactTable({
        data: resources || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
        state: { columnFilters, columnVisibility, rowSelection, sorting },
        autoResetPageIndex: false,
        getRowId: (row) => row._id as string
    });

    if (loading) return <TableSkeleton />;
    if (isError) return <GenericError />;

    const isRowSelected = Object.keys(rowSelection).length > 0;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <ResourcesTableSearch table={table} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <ResourcesTableFilter table={table} />
                    <ResourcesTableVisibility table={table} />
                    <ResourcesTableExport table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <ResourcesTableDelete scopeId={scopeId} table={table} />
                            <ResourcesTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateResourceDialog scopeId={scopeId} />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <ResourcesTableMain table={table} />
            </div>
            <ResourcesTablePagination table={table} />
        </div>
    );
}

export default ResourcesTable;
