import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CreateExclusiveDialog from "@/components/exclusives/CreateExclusiveDialog";
import ExclusivesTableAttended from "@/components/exclusives/ExclusivesTableAttended";
import { ExclusivesTableColumnDefs } from "@/components/exclusives/ExclusivesTableColumnDefs";
import ExclusivesTableDelete from "@/components/exclusives/ExclusivesTableDelete";
import ExclusivesTableExport from "@/components/exclusives/ExclusivesTableExport";
import ExclusivesTableFilter from "@/components/exclusives/ExclusivesTableFilter";
import ExclusivesTableFilterAttended from "@/components/exclusives/ExclusivesTableFilterAttended";
import ExclusivesTableMain from "@/components/exclusives/ExclusivesTableMain";
import ExclusivesTablePagination from "@/components/exclusives/ExclusivesTablePagination";
import ExclusivesTableResetSelection from "@/components/exclusives/ExclusivesTableResetSelection";
import ExclusivesTableSearch from "@/components/exclusives/ExclusivesTableSearch";
import ExclusivesTableVisibility from "@/components/exclusives/ExclusivesTableVisibility";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useGetAllExclusives } from "@/hooks/exclusives/useGetAllExclusives";
import { StructureExclusiveTableData, StructureFilterableFields, StructureSerchableFields } from "@/services/exclusives/Exclusives.helpers";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";

type ExclusivesTableProps = {
    eventId: string;
};

function ExclusivesTable({ eventId }: ExclusivesTableProps) {
    const { i18n } = useTranslation();
    const { attendance, loading: loadingUserAttendance } = useUserAttendance(eventId);
    const { exclusives, loading: loadingExclusives } = useGetAllExclusives(eventId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const data = useMemo(() => {
        // Early return (security check)
        if (!attendance || !exclusives) return [];
        // Strucuture data
        return StructureExclusiveTableData(exclusives);
    }, [attendance, exclusives]);

    const columns = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsExclusives) return [];
        // Strucuture columns
        return ExclusivesTableColumnDefs(eventId, attendance.formFieldsExclusives, i18n.language);
    }, [eventId, attendance, i18n.language]);

    const searchFields = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsExclusives) return {};
        // Strucuture search fields
        return StructureSerchableFields(attendance.formFieldsExclusives);
    }, [attendance]);

    const filterFields = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsExclusives) return {};
        // Strucuture filter fields
        return StructureFilterableFields(attendance.formFieldsExclusives);
    }, [attendance]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        initialState: { pagination: { pageIndex: 0, pageSize: 20 } },
        state: { columnFilters, columnVisibility, rowSelection },
        autoResetPageIndex: false,
        getRowId: (row) => row._id as string
    });

    if (loadingUserAttendance || loadingExclusives) return <TableSkeleton />;

    const isRowSelected = Object.keys(rowSelection).length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <ExclusivesTableSearch table={table} searchFields={searchFields} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <ExclusivesTableFilter table={table} filterFields={filterFields} />
                    <ExclusivesTableFilterAttended table={table} />
                    <ExclusivesTableVisibility table={table} />
                    <ExclusivesTableExport formFields={attendance?.formFieldsExclusives || {}} table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <ExclusivesTableDelete eventId={eventId} table={table} />
                            <ExclusivesTableAttended eventId={eventId} table={table} />
                            <ExclusivesTableResetSelection table={table} />
                        </Fragment>
                    )}
                    <CreateExclusiveDialog />
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <ExclusivesTableMain table={table} />
            </div>
            <ExclusivesTablePagination table={table} />
        </div>
    );
}

export default ExclusivesTable;
