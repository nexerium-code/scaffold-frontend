import { CheckCheck, Filter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StaffTypes } from "@/lib/enums";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";

interface StaffTableFilterProps<TData> {
    table: Table<TData>;
}

function StaffTableFilter<TData>({ table }: StaffTableFilterProps<TData>) {
    const { t } = useTranslation();
    const [value, setValue] = useState<string | undefined>();
    const isFilterApplied = Boolean(value);

    function handleValueChange(newValue: string) {
        setValue(newValue);
        table.setColumnFilters((oldFilters) => {
            const otherFilters = oldFilters.filter((filter) => filter.id !== "type");
            return [
                ...otherFilters,
                {
                    id: "type",
                    value: newValue
                }
            ];
        });
    }

    function handleClear() {
        setValue(undefined);
        table.setColumnFilters((oldFilters) => {
            return oldFilters.filter((filter) => filter.id !== "type");
        });
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={cn(isFilterApplied && "bg-teal-100")}>
                            <Filter />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start" className="min-w-52">
                    <Command>
                        <CommandInput placeholder={t("search-type-dots")} className="h-9" />
                        <CommandList>
                            <CommandEmpty>{t("no-type-found")}</CommandEmpty>
                            {Object.values(StaffTypes).map((type) => (
                                <CommandItem
                                    key={type}
                                    value={type}
                                    onSelect={() => {
                                        handleValueChange(type);
                                    }}
                                >
                                    {capitalizeFirstLetter(type)}
                                    {type === value && <CheckCheck className="ms-auto" />}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                    {value && (
                        <DropdownMenuItem variant="destructive" onClick={handleClear}>
                            {t("clear-filters")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("filter-type")}</TooltipContent>
        </Tooltip>
    );
}

export default StaffTableFilter;
