import { ListFilter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResourceStatusTypes } from "@/lib/enums";

function ResourcesTableFilter<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();
    const selectedStatuses = (table.getColumn("status")?.getFilterValue() as string[]) ?? [];

    function handleStatus(status: string, checked: boolean) {
        const nextStatuses = checked ? [...selectedStatuses, status] : selectedStatuses.filter((item) => item !== status);
        table.getColumn("status")?.setFilterValue(nextStatuses.length ? nextStatuses : undefined);
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <ListFilter />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t("status")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {Object.values(ResourceStatusTypes).map((status) => (
                            <DropdownMenuCheckboxItem key={status} checked={selectedStatuses.includes(status)} onCheckedChange={(checked) => handleStatus(status, checked === true)}>
                                {t(status)}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("filter-resources")}</TooltipContent>
        </Tooltip>
    );
}

export default ResourcesTableFilter;
