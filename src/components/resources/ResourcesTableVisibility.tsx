import { Columns2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

function ResourcesTableVisibility<TData>({ table }: { table: Table<TData> }) {
    const { t } = useTranslation();
    const columnLabels: Record<string, string> = {
        name: "name",
        ownerEmail: "owner-email",
        status: "status",
        updatedAt: "updated-at"
    };

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Columns2 />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t("toggle-columns")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem key={column.id} checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                                    {t(columnLabels[column.id] ?? column.id)}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("toggle-columns")}</TooltipContent>
        </Tooltip>
    );
}

export default ResourcesTableVisibility;
