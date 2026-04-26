import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RepliesCSVExporter, RepliesJSONExporter, StructureRepliesToExport } from "@/services/replies/Replies.helpers";
import { Table } from "@tanstack/react-table";

type RepliesTableExportProps<TData> = {
    table: Table<TData>;
};

function RepliesTableExport<TData>({ table }: RepliesTableExportProps<TData>) {
    const { t } = useTranslation();

    function handleCSVExport() {
        const replies = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const rows = StructureRepliesToExport(replies as { data: string }[]);
        RepliesCSVExporter(rows);
    }

    function handleJSONExport() {
        const replies = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureRepliesToExport(replies as { data: string }[]);
        RepliesJSONExporter(data);
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
            <TooltipContent>{t("export-replies")}</TooltipContent>
        </Tooltip>
    );
}

export default RepliesTableExport;
