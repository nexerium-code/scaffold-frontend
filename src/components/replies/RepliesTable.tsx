import { useMemo, useState } from "react";

import { RepliesTableColumnDefs } from "@/components/replies/RepliesTableColumnDefs";
import RepliesTableExport from "@/components/replies/RepliesTableExport";
import RepliesTableMain from "@/components/replies/RepliesTableMain";
import RepliesTablePagination from "@/components/replies/RepliesTablePagination";
import RepliesTableSearch from "@/components/replies/RepliesTableSearch";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { useGetAllReplies } from "@/hooks/replies/useGetAllReplies";
import { StructureRepliesTableData } from "@/services/replies/Replies.helpers";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

type RepliesTableProps = {
    eventId: string;
    feedbackId: string;
};

function RepliesTable({ eventId, feedbackId }: RepliesTableProps) {
    const { replies, loading } = useGetAllReplies(eventId, feedbackId);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const data = useMemo(() => {
        return StructureRepliesTableData(replies || []);
    }, [replies]);

    const table = useReactTable({
        data,
        columns: RepliesTableColumnDefs,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
        state: { columnFilters }
    });

    if (loading) return <TableSkeleton small />;

    return (
        <div className="space-y-4 overflow-x-hidden">
            <div className="flex items-center justify-between gap-4">
                <RepliesTableSearch table={table} />
                <RepliesTableExport table={table} />
            </div>
            <div className="rounded-md border">
                <RepliesTableMain table={table} />
            </div>
            <RepliesTablePagination table={table} />
        </div>
    );
}

export default RepliesTable;
