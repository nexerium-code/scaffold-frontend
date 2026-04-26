import { format } from "date-fns";
import { CalendarSearch } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { AttendanceDateSchemaType } from "@/services/attendance/Attendance.main.schemas";
import { Table } from "@tanstack/react-table";

type AttendeesTableFilterSelectedDatesProps<TData> = {
    table: Table<TData>;
    dates: AttendanceDateSchemaType[];
};

export function AttendeesTableFilterSelectedDates<TData>({ table, dates }: AttendeesTableFilterSelectedDatesProps<TData>) {
    const { t } = useTranslation();
    const attendanceDates = dates.map((date) => ({ value: String(date.value), active: date.active }));
    const filterValue = table.getState().columnFilters.find((f) => f.id === "selectedDates")?.value as string[] | undefined;
    const currentValues = filterValue ? [...filterValue] : [];
    const isFilterApplied = currentValues.length > 0;

    function handleCheckboxChange(dateString: string, checked: boolean) {
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === "selectedDates");
            const currentValues = existingFilter && Array.isArray(existingFilter.value) ? (existingFilter.value as string[]) : [];

            let newValues: string[];
            if (checked) {
                newValues = currentValues.includes(dateString) ? currentValues : [...currentValues, dateString];
            } else {
                newValues = currentValues.filter((v) => v !== dateString);
            }

            if (newValues.length === 0) {
                return prev.filter((f) => f.id !== "selectedDates");
            }

            if (existingFilter) {
                return prev.map((f) => (f.id === "selectedDates" ? { ...f, value: newValues } : f));
            }

            return [...prev, { id: "selectedDates", value: newValues }];
        });
    }

    function resetDatesFilter() {
        table.setColumnFilters((prev) => prev.filter((f) => f.id !== "selectedDates"));
    }

    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className={cn(isFilterApplied && "bg-teal-100")}>
                            <CalendarSearch />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>{t("filter-dates")}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {attendanceDates.map((date) => (
                        <DropdownMenuCheckboxItem key={date.value} checked={currentValues.includes(date.value)} onCheckedChange={(checked) => handleCheckboxChange(date.value, checked)}>
                            {format(date.value, "P")}
                        </DropdownMenuCheckboxItem>
                    ))}
                    {isFilterApplied && (
                        <DropdownMenuItem variant="destructive" onClick={resetDatesFilter}>
                            {t("clear-filters")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>{t("filter-dates")}</TooltipContent>
        </Tooltip>
    );
}
