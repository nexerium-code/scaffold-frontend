import { RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function ResourcesTableResetSelection<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => table.resetRowSelection()}>
                    <RotateCcw />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{t("reset-selection")}</TooltipContent>
        </Tooltip>
    );
}

export default ResourcesTableResetSelection;
