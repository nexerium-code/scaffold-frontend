import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Staff } from "@/services/staff/Staff.api";
import { StaffCSVExporter, StaffJSONExporter, StructureStaffToExport } from "@/services/staff/Staff.helpers";
import { Table } from "@tanstack/react-table";

type StaffTableExportProps<TData> = {
    table: Table<TData>;
};

function StaffTableExport<TData>({ table }: StaffTableExportProps<TData>) {
    const { t } = useTranslation();

    function handleCSVExport() {
        const staffMembers = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureStaffToExport(staffMembers as Staff[]);
        StaffCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const staffMembers = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureStaffToExport(staffMembers as Staff[]);
        StaffJSONExporter(data.data);
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
            <TooltipContent>{t("export-staff")}</TooltipContent>
        </Tooltip>
    );
}

export default StaffTableExport;
