import { useMemo, useState } from "react";

import { WorkshopTableColumnDefs } from "@/components/workshop/WorkshopTableColumnDefs";
import WorkshopTableFilterPublished from "@/components/workshop/WorkshopTableFilterPublished";
import WorkshopTableMain from "@/components/workshop/WorkshopTableMain";
import WorkshopTableSearch from "@/components/workshop/WorkshopTableSearch";
import { useGetAllWorkshops } from "@/hooks/workshop/useGetAllWorkshop";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

type WorkshopTableProps = {
    eventId: string;
};

function WorkshopTable({ eventId }: WorkshopTableProps) {
    const { workshops } = useGetAllWorkshops(eventId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns = useMemo(() => {
        return WorkshopTableColumnDefs(eventId);
    }, [eventId]);

    const table = useReactTable({
        data: workshops || [],
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
                <WorkshopTableSearch table={table} />
                <WorkshopTableFilterPublished table={table} />
            </div>
            <WorkshopTableMain eventId={eventId} table={table} />
        </div>
    );
}

export default WorkshopTable;
