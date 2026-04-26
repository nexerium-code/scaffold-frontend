import { SearchCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Table } from '@tanstack/react-table';

type EnrolleesTableFilterApprovedProps<TData> = {
    table: Table<TData>;
};

function EnrolleesTableFilterApproved<TData>({ table }: EnrolleesTableFilterApprovedProps<TData>) {
    const { t } = useTranslation();
    const filterValue = table.getState().columnFilters.find((f) => f.id === "approved")?.value;
    const isFilterApplied = Boolean(filterValue);

    function handleRadioChange(value: string) {
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === "approved");
            if (existingFilter && existingFilter.value === value) {
                return prev.filter((f) => f.id !== "approved");
            }
            if (existingFilter) {
                return prev.map((f) => (f.id === "approved" ? { ...f, value } : f));
            }
            return [...prev, { id: "approved", value }];
        });
    }

    function resetApprovedFilter() {
        table.setColumnFilters((prev) => prev.filter((f) => f.id !== "approved"));
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={cn(isFilterApplied && "bg-teal-100")}>
                            <SearchCheck />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t("toggle-approved")}</DropdownMenuLabel>
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
                        <DropdownMenuItem variant="destructive" onClick={resetApprovedFilter}>
                            {t("clear-filters")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("filter-approved")}</TooltipContent>
        </Tooltip>
    );
}

export default EnrolleesTableFilterApproved;
