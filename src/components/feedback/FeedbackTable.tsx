import { useMemo, useState } from "react";

import { FeedbackTableColumnDefs } from "@/components/feedback/FeedbackTableColumnDefs";
import FeedbackTableFilterPublished from "@/components/feedback/FeedbackTableFilterPublished";
import FeedbackTableMain from "@/components/feedback/FeedbackTableMain";
import FeedbackTableSearch from "@/components/feedback/FeedbackTableSearch";
import { useGetAllFeedbacks } from "@/hooks/feedback/useGetAllFeedbacks";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

type FeedbackTableProps = {
    eventId: string;
};

function FeedbackTable({ eventId }: FeedbackTableProps) {
    const { feedbacks } = useGetAllFeedbacks(eventId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns = useMemo(() => {
        return FeedbackTableColumnDefs(eventId);
    }, [eventId]);

    const table = useReactTable({
        data: feedbacks || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
        state: { columnFilters },
        autoResetPageIndex: false
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <FeedbackTableSearch table={table} />
                <FeedbackTableFilterPublished table={table} />
            </div>
            <FeedbackTableMain eventId={eventId} table={table} />
        </div>
    );
}

export default FeedbackTable;
