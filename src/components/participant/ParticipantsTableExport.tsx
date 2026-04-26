import { Braces, FileDown, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Participant } from "@/services/participant/Participant.api";
import { ParticipantCSVExporter, ParticipantJSONExporter, StructureParticipantToExport } from "@/services/participant/Participant.helpers";
import { Table } from "@tanstack/react-table";

type ParticipantsTableExportProps<TData> = {
    table: Table<TData>;
};

function ParticipantsTableExport<TData>({ table }: ParticipantsTableExportProps<TData>) {
    const { t } = useTranslation();

    function handleCSVExport() {
        const participants = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureParticipantToExport(participants as Participant[]);
        ParticipantCSVExporter(data.headers, data.data);
    }

    function handleJSONExport() {
        const participants = table.getFilteredRowModel().flatRows.map((row) => row.original);
        const data = StructureParticipantToExport(participants as Participant[]);
        ParticipantJSONExporter(data.data);
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
            <TooltipContent>{t("export-participants")}</TooltipContent>
        </Tooltip>
    );
}

export default ParticipantsTableExport;
