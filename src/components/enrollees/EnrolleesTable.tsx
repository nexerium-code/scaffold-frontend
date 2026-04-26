import { Fragment, useMemo, useState } from "react";

import CreateEnrolleeDialog from "@/components/enrollees/CreateEnrolleeDialog";
import EnrolleesTableApprove from "@/components/enrollees/EnrolleesTableApprove";
import { EnrolleesTableColumnDefs } from "@/components/enrollees/EnrolleesTableColumnDefs";
import EnrolleesTableDelete from "@/components/enrollees/EnrolleesTableDelete";
import EnrolleesTableExport from "@/components/enrollees/EnrolleesTableExport";
import EnrolleesTableFilterApproved from "@/components/enrollees/EnrolleesTableFilterApproved";
import EnrolleesTableMain from "@/components/enrollees/EnrolleesTableMain";
import EnrolleesTablePagination from "@/components/enrollees/EnrolleesTablePagination";
import EnrolleesTableResetSelection from "@/components/enrollees/EnrolleesTableResetSelection";
import EnrolleesTableSearch from "@/components/enrollees/EnrolleesTableSearch";
import EnrolleesTableVisibility from "@/components/enrollees/EnrolleesTableVisibility";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { useGetAllEnrollees } from "@/hooks/enrollees/useGetAllEnrollees";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";

type EnrolleesTableProps = {
    eventId: string;
    workshopId: string;
};

function EnrolleesTable({ eventId, workshopId }: EnrolleesTableProps) {
    const { enrollees, loading } = useGetAllEnrollees(eventId, workshopId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const columns = useMemo(() => {
        // Early return (security check)
        if (!enrollees || !enrollees.length) return [];
        // Strucuture columns
        return EnrolleesTableColumnDefs(eventId, workshopId);
    }, [enrollees, eventId, workshopId]);

    const table = useReactTable({
        data: enrollees || [],
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
                <EnrolleesTableSearch table={table} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <EnrolleesTableFilterApproved table={table} />
                    <EnrolleesTableVisibility table={table} />
                    <EnrolleesTableExport table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <EnrolleesTableDelete eventId={eventId} workshopId={workshopId} table={table} />
                            <EnrolleesTableApprove eventId={eventId} workshopId={workshopId} table={table} />
                            <EnrolleesTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateEnrolleeDialog eventId={eventId} workshopId={workshopId} />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <EnrolleesTableMain table={table} />
            </div>
            <EnrolleesTablePagination table={table} />
        </div>
    );
}

export default EnrolleesTable;
