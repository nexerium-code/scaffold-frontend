import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ExclusiveCSVExporter, ExclusiveJSONExporter, StructureExclusiveToExport } from "@/services/exclusives/Exclusives.helpers";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";
import { Table } from "@tanstack/react-table";

type ExclusivesTableExportProps<TData> = {
    table: Table<TData>;
    formFields: Record<string, FormInputSchemaType>;
};

function ExclusivesTableExport<TData>({ table, formFields }: ExclusivesTableExportProps<TData>) {
    const { t } = useTranslation();
    function handleCSVExport() {
        const exclusives = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureExclusiveToExport(formFields, exclusives as Record<string, unknown>[]);
        ExclusiveCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const exclusives = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureExclusiveToExport(formFields, exclusives as Record<string, unknown>[]);
        ExclusiveJSONExporter(data.data);
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
            <TooltipContent>{t("export-exclusives")}</TooltipContent>
        </Tooltip>
    );
}

export default ExclusivesTableExport;
