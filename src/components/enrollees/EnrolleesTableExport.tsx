import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Enrollee } from "@/services/enrollees/Enrollees.api";
import { EnrolleeCSVExporter, EnrolleeJSONExporter, StructureEnrolleeToExport } from "@/services/enrollees/Enrollees.helpers";
import { Table } from "@tanstack/react-table";

type EnrolleesTableExportProps<TData> = {
    table: Table<TData>;
};

function EnrolleesTableExport<TData>({ table }: EnrolleesTableExportProps<TData>) {
    const { t } = useTranslation();

    function handleCSVExport() {
        const enrollees = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureEnrolleeToExport(enrollees as Enrollee[]);
        EnrolleeCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const enrollees = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureEnrolleeToExport(enrollees as Enrollee[]);
        EnrolleeJSONExporter(data.data);
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
            <TooltipContent>{t("export-enrollees")}</TooltipContent>
        </Tooltip>
    );
}

export default EnrolleesTableExport;
