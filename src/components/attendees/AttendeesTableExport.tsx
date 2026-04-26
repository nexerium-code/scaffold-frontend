import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AttendeeCSVExporter, AttendeeJSONExporter, StructureAttendeeToExport } from "@/services/attendees/Attendees.helpers";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";
import { Table } from "@tanstack/react-table";

type AttendeesTableExportProps<TData> = {
    table: Table<TData>;
    formFields: Record<string, FormInputSchemaType>;
};

function AttendeesTableExport<TData>({ table, formFields }: AttendeesTableExportProps<TData>) {
    const { t } = useTranslation();
    function handleCSVExport() {
        const attendees = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureAttendeeToExport(formFields, attendees as Record<string, unknown>[]);
        AttendeeCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const attendees = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureAttendeeToExport(formFields, attendees as Record<string, unknown>[]);
        AttendeeJSONExporter(data.data);
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <FileDown />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleCSVExport}>
                        <Table2 />
                        {t("csv")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleJSONExport}>
                        <Braces />
                        {t("json")}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("export-attendees")}</TooltipContent>
        </Tooltip>
    );
}

export default AttendeesTableExport;
