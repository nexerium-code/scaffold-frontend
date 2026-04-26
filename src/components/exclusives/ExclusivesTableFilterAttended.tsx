import { ClipboardCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';

type ExclusivesTableFilterAttendedProps<TData> = {
    table: Table<TData>;
};

function ExclusivesTableFilterAttended<TData>({ table }: ExclusivesTableFilterAttendedProps<TData>) {
    const { t } = useTranslation();
    const filterValue = table.getState().columnFilters.find((f) => f.id === "attended")?.value;
    const isFilterApplied = Boolean(filterValue);

    function handleRadioChange(value: string) {
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === "attended");
            if (existingFilter && existingFilter.value === value) {
                return prev.filter((f) => f.id !== "attended");
            }
            if (existingFilter) {
                return prev.map((f) => (f.id === "attended" ? { ...f, value } : f));
            }
            return [...prev, { id: "attended", value }];
        });
    }

    function resetAttendedFilter() {
        table.setColumnFilters((prev) => prev.filter((f) => f.id !== "attended"));
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={cn(isFilterApplied && "bg-teal-100")}>
                            <ClipboardCheck />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t("toggle-attended")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={typeof filterValue === "string" ? filterValue : ""} onValueChange={handleRadioChange}>
                        <DropdownMenuRadioItem value="true" onSelect={(e) => e.preventDefault()}>
                            {t("true")}
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="false" onSelect={(e) => e.preventDefault()}>
                            {t("false")}
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    {isFilterApplied && (
                        <DropdownMenuItem variant="destructive" onClick={resetAttendedFilter}>
                            {t("clear-filters")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("filter-attended")}</TooltipContent>
        </Tooltip>
    );
}

export default ExclusivesTableFilterAttended;
