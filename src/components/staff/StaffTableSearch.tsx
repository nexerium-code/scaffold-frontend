import { ChevronDownIcon, Search } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { ColumnFiltersState, Table } from "@tanstack/react-table";

type StaffTableSearchProps<TData> = {
    table: Table<TData>;
    searchFields?: string[];
};

function StaffTableSearch<TData>({ table, searchFields = ["name", "email", "phone", "identification"] }: StaffTableSearchProps<TData>) {
    const { t } = useTranslation();

    // Determine the default target from table state, if any; otherwise default to the first search field.
    const currentFilters: ColumnFiltersState = table.getState().columnFilters;
    const defaultTarget = currentFilters.find((filter) => searchFields.includes(filter.id))?.id || searchFields[0];

    // Use local state for target to allow immediate changes.
    const [target, setTarget] = useState(defaultTarget);

    // Retrieve the current filter value for the active target.
    const filterValue = (table.getColumn(target)?.getFilterValue() as string) ?? "";

    function handleSearch(query: string) {
        table.setColumnFilters((oldFilters) => {
            // Remove any existing filter for any search field.
            const otherFilters = oldFilters.filter((filter) => !searchFields.includes(filter.id));
            // If query is empty, simply return other filters.
            if (query === "") return otherFilters;
            // Otherwise, update filter for the current target.
            return [...otherFilters, { id: target, value: query }];
        });
    }

    function handleTarget(newTarget: string) {
        // Retrieve the current query from the current target.
        const currentQuery = (table.getColumn(target)?.getFilterValue() as string) || "";
        // Update the local target state.
        setTarget(newTarget);
        // Update table filters: remove all filters from search fields and add new filter with the current query.
        table.setColumnFilters((oldFilters) => {
            const otherFilters = oldFilters.filter((filter) => !searchFields.includes(filter.id));
            return [...otherFilters, { id: newTarget, value: currentQuery }];
        });
    }

    return (
        <InputGroup className="max-w-sm">
            <InputGroupAddon>
                <Search />
            </InputGroupAddon>
            <InputGroupInput placeholder={t("search-dots")} value={filterValue} onChange={(e) => handleSearch(e.target.value)} />
            <InputGroupAddon align="inline-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <InputGroupButton variant="ghost" className="pe-1.5! text-xs">
                            {t(target)} <ChevronDownIcon className="size-3" />
                        </InputGroupButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-max" align="start">
                        <DropdownMenuLabel>{t("target")}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={target} onValueChange={handleTarget}>
                            {searchFields.map((key) => (
                                <DropdownMenuRadioItem key={key} value={key}>
                                    {t(key)}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default StaffTableSearch;
