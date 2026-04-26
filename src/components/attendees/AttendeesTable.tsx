import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import AttendeesTableAttended from "@/components/attendees/AttendeesTableAttended";
import { AttendeesTableColumnDefs } from "@/components/attendees/AttendeesTableColumnDefs";
import AttendeesTableDelete from "@/components/attendees/AttendeesTableDelete";
import AttendeesTableExport from "@/components/attendees/AttendeesTableExport";
import AttendeesTableFilter from "@/components/attendees/AttendeesTableFilter";
import AttendeesTableFilterAttended from "@/components/attendees/AttendeesTableFilterAttended";
import { AttendeesTableFilterSelectedDates } from "@/components/attendees/AttendeesTableFilterSelectedDates";
import AttendeesTableMain from "@/components/attendees/AttendeesTableMain";
import AttendeesTablePagination from "@/components/attendees/AttendeesTablePagination";
import AttendeesTableResetSelection from "@/components/attendees/AttendeesTableResetSelection";
import AttendeesTableSearch from "@/components/attendees/AttendeesTableSearch";
import AttendeesTableVisibility from "@/components/attendees/AttendeesTableVisibility";
import TableSkeleton from "@/components/skeleton/TableSkeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useGetAllAttendees } from "@/hooks/attendees/useGetAllAttendees";
import { AttendanceTypes } from "@/lib/enums";
import { StructureAttendeePaidTableData, StructureAttendeeTableData, StructureFilterableFields, StructureSerchableFields } from "@/services/attendees/Attendees.helpers";
import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";

type AttendeesTableProps = {
    eventId: string;
};

function AttendeesTable({ eventId }: AttendeesTableProps) {
    const { i18n } = useTranslation();
    const { attendance, loading: loadingUserAttendance } = useUserAttendance(eventId);
    const { attendees, loading: loadingAttendees } = useGetAllAttendees(eventId);

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const data = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendees) return [];
        // Strucuture data for paid attendance type
        if (attendance.type === AttendanceTypes.PAID) return StructureAttendeePaidTableData(attendees);
        // Strucuture data for free attendance type
        if (attendance.type === AttendanceTypes.FREE) return StructureAttendeeTableData(attendees);
        // Default return
        return [];
    }, [attendance, attendees]);

    const columns = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsAttendees) return [];
        // Strucuture columns
        return AttendeesTableColumnDefs(eventId, attendance.type || AttendanceTypes.FREE, attendance.formFieldsAttendees, i18n.language);
    }, [eventId, attendance, i18n.language]);

    const searchFields = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsAttendees) return {};
        // Strucuture search fields
        return StructureSerchableFields(attendance.formFieldsAttendees);
    }, [attendance]);

    const filterFields = useMemo(() => {
        // Early return (security check)
        if (!attendance || !attendance.formFieldsAttendees) return {};
        // Strucuture filter fields
        return StructureFilterableFields(attendance.formFieldsAttendees);
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

    if (loadingUserAttendance || loadingAttendees) return <TableSkeleton />;

    const isRowSelected = Object.keys(rowSelection).length > 0;

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                <AttendeesTableSearch table={table} searchFields={searchFields} />
                <ButtonGroup className="flex w-full *:flex-1 md:w-auto">
                    <AttendeesTableFilter table={table} filterFields={filterFields} />
                    <AttendeesTableFilterSelectedDates table={table} dates={attendance?.dates || []} />
                    <AttendeesTableFilterAttended table={table} />
                    <AttendeesTableVisibility table={table} />
                    <AttendeesTableExport formFields={attendance?.formFieldsAttendees || {}} table={table} />
                    {isRowSelected && (
                        <Fragment>
                            <AttendeesTableDelete eventId={eventId} table={table} />
                            <AttendeesTableAttended eventId={eventId} table={table} />
                            <AttendeesTableResetSelection table={table} />
                        </Fragment>
                    )}
                </ButtonGroup>
            </div>
            <div className="overflow-hidden rounded-md border">
                <AttendeesTableMain table={table} />
            </div>
            <AttendeesTablePagination table={table} />
        </div>
    );
}

export default AttendeesTable;
