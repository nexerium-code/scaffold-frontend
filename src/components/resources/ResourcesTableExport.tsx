import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Resource } from "@/services/resources/Resources.api";
import { ResourcesCSVExporter, ResourcesJSONExporter, StructureResourceToExport } from "@/services/resources/Resources.helpers";

function ResourcesTableExport<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();

    function handleCSVExport() {
        const resources = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureResourceToExport(resources as Resource[]);
        ResourcesCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const resources = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureResourceToExport(resources as Resource[]);
        ResourcesJSONExporter(data.data);
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
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={handleCSVExport}>
                            <Table2 />
                            {t("csv")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleJSONExport}>
                            <Braces />
                            {t("json")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("export-resources")}</TooltipContent>
        </Tooltip>
    );
}

export default ResourcesTableExport;
