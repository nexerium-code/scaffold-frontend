import { Fragment, useMemo, useState } from "react";

import CreateParticipantDialog from "@/components/participant/CreateParticipantDialog";
import ParticipantsTableApprove from "@/components/participant/ParticipantsTableApprove";
import { ParticipantsTableColumnDefs } from "@/components/participant/ParticipantsTableColumnDefs";
import ParticipantsTableDelete from "@/components/participant/ParticipantsTableDelete";
import ParticipantsTableExport from "@/components/participant/ParticipantsTableExport";
import ParticipantsTableFilterApproved from "@/components/participant/ParticipantsTableFilterApproved";
import ParticipantsTableFilterType from "@/components/participant/ParticipantsTableFilterType";
import ParticipantsTableMain from "@/components/participant/ParticipantsTableMain";
import ParticipantsTablePagination from "@/components/participant/ParticipantsTablePagination";
import ParticipantsTableResetSelection from "@/components/participant/ParticipantsTableResetSelection";
import ParticipantsTableSearch from "@/components/participant/ParticipantsTableSearch";
import ParticipantsTableVisibility from "@/components/participant/ParticipantsTableVisibility";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { useGetAllParticipants } from "@/hooks/participant/useGetAllParticipants";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";

type ParticipantsTableProps = {
    eventId: string;
};

function ParticipantsTable({ eventId }: ParticipantsTableProps) {
    const { participants, loading } = useGetAllParticipants(eventId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const columns = useMemo(() => {
        // Early return (security check)
        if (!participants || !participants.length) return [];
        // Strucuture columns
        return ParticipantsTableColumnDefs(eventId);
    }, [participants, eventId]);

    const table = useReactTable({
        data: participants || [],
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
                <ParticipantsTableSearch table={table} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <ParticipantsTableFilterType table={table} />
                    <ParticipantsTableFilterApproved table={table} />
                    <ParticipantsTableVisibility table={table} />
                    <ParticipantsTableExport table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <ParticipantsTableDelete eventId={eventId} table={table} />
                            <ParticipantsTableApprove eventId={eventId} table={table} />
                            <ParticipantsTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateParticipantDialog />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <ParticipantsTableMain table={table} />
            </div>
            <ParticipantsTablePagination table={table} />
        </div>
    );
}

export default ParticipantsTable;
