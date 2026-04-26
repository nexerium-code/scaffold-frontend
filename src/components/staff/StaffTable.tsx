import { Fragment, useMemo, useState } from "react";

import TableSkeleton from "@/components/skeleton/TableSkeleton";
import CreateStaffDialog from "@/components/staff/CreateStaffDialog";
import { StaffTableColumnDefs } from "@/components/staff/StaffTableColumnDefs";
import StaffTableDelete from "@/components/staff/StaffTableDelete";
import StaffTableExport from "@/components/staff/StaffTableExport";
import StaffTableFilter from "@/components/staff/StaffTableFilter";
import StaffTableMain from "@/components/staff/StaffTableMain";
import StaffTablePagination from "@/components/staff/StaffTablePagination";
import StaffTableResetSelection from "@/components/staff/StaffTableResetSelection";
import StaffTableSearch from "@/components/staff/StaffTableSearch";
import StaffTableVisibility from "@/components/staff/StaffTableVisibility";
import { ButtonGroup } from "@/components/ui/button-group";
import { useGetAllStaff } from "@/hooks/staff/useGetAllStaff";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";

type StaffTableProps = {
    eventId: string;
    participantId: string;
};

function StaffTable({ eventId, participantId }: StaffTableProps) {
    const { staff, loading } = useGetAllStaff(eventId, participantId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const columns = useMemo(() => {
        // Early return (security check)
        if (!staff || !staff.length) return [];
        // Strucuture columns
        return StaffTableColumnDefs(eventId, participantId);
    }, [staff, eventId, participantId]);

    const table = useReactTable({
        data: staff || [],
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
                <StaffTableSearch table={table} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <StaffTableFilter table={table} />
                    <StaffTableVisibility table={table} />
                    <StaffTableExport table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <StaffTableDelete eventId={eventId} participantId={participantId} table={table} />
                            <StaffTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateStaffDialog eventId={eventId} participantId={participantId} />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <StaffTableMain table={table} />
            </div>
            <StaffTablePagination table={table} />
        </div>
    );
}

export default StaffTable;
