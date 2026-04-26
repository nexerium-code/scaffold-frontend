import { ListFilter, Trash } from 'lucide-react';
import { Fragment } from 'react/jsx-runtime';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FormInputTypes } from '@/lib/enums';
import { cn } from '@/lib/utils';
import { FormInputSchemaType } from '@/services/form-fields/FormFields.schemas';
import { Table } from '@tanstack/react-table';

type ExclusivesTableFilterProps<TData> = {
    table: Table<TData>;
    filterFields: Record<string, FormInputSchemaType>;
};

function ExclusivesTableFilter<TData>({ table, filterFields }: ExclusivesTableFilterProps<TData>) {
    const { t, i18n } = useTranslation();

    function resetColumnFilters() {
        table.setColumnFilters((prev) => prev.filter((f) => !Object.keys(filterFields).includes(f.id)));
    }

    // Calculate applied filters for the provided filterFields.
    const appliedFilters = table.getState().columnFilters.filter((filter) => Object.keys(filterFields).includes(filter.id));

    return (
        <Fragment>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className={cn(appliedFilters.length > 0 && "bg-teal-100")}>
                        <ListFilter />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" hideWhenDetached={false}>
                    <DropdownMenuGroup>
                        {Object.entries(filterFields).map(([key, field]) => {
                            const filterValue = table.getState().columnFilters.find((f) => f.id === key)?.value;
                            const fieldTitle = i18n.language === "en-US" ? field.titleEN : field.titleAR;

                            if (field.type === FormInputTypes.RADIO || field.type === FormInputTypes.SELECT) {
                                return <RadioAndSelectFilter key={key} table={table} fieldKey={key} fieldTitle={fieldTitle} fieldData={field} filterValue={filterValue} />;
                            }

                            if (field.type === FormInputTypes.CHECKBOX) {
                                return <CheckboxFilter key={key} table={table} fieldKey={key} fieldTitle={fieldTitle} fieldData={field} filterValue={filterValue} />;
                            }

                            if (field.type === FormInputTypes.DATE) {
                                return <DateFilter key={key} table={table} fieldKey={key} fieldTitle={fieldTitle} fieldData={field} filterValue={filterValue} />;
                            }

                            if (field.type === FormInputTypes.NUMBER) {
                                return <NumberFilter key={key} table={table} fieldKey={key} fieldTitle={fieldTitle} fieldData={field} filterValue={filterValue} />;
                            }

                            return null;
                        })}
                    </DropdownMenuGroup>
                    {appliedFilters.length > 0 && (
                        <DropdownMenuItem variant="destructive" onClick={resetColumnFilters}>
                            {t("clear-filters")}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </Fragment>
    );
}

type FilterItemProps<TData> = {
    table: Table<TData>;
    fieldKey: string;
    fieldTitle: string;
    fieldData: FormInputSchemaType;
    filterValue: unknown;
};

function RadioAndSelectFilter<TData>({ table, fieldKey, fieldTitle, fieldData, filterValue }: FilterItemProps<TData>) {
    function handleRadioAndSelectChange(key: string, value: string) {
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === key);
            if (existingFilter && existingFilter.value === value) {
                return prev.filter((f) => f.id !== key);
            }
            if (existingFilter) {
                return prev.map((f) => (f.id === key ? { ...f, value } : f));
            }
            return [...prev, { id: key, value }];
        });
    }

    const isFilterApplied = Boolean(filterValue);

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {fieldTitle} {isFilterApplied ? "●" : ""}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={typeof filterValue === "string" ? filterValue : ""} onValueChange={(value) => handleRadioAndSelectChange(fieldKey, value)}>
                        {fieldData.options?.map((option) => (
                            <DropdownMenuRadioItem key={option} value={option} onSelect={(e) => e.preventDefault()}>
                                {option}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}

function CheckboxFilter<TData>({ table, fieldKey, fieldTitle, fieldData, filterValue }: FilterItemProps<TData>) {
    function handleCheckboxChange(key: string, option: string, checked: boolean) {
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === key);
            const currentValues: string[] = existingFilter && Array.isArray(existingFilter.value) ? (existingFilter.value as string[]) : [];
            let newValues: string[];
            if (checked) {
                newValues = currentValues.includes(option) ? currentValues : [...currentValues, option];
            } else {
                newValues = currentValues.filter((v) => v !== option);
            }
            if (newValues.length === 0) {
                return prev.filter((f) => f.id !== key);
            }
            if (existingFilter) {
                return prev.map((f) => (f.id === key ? { ...f, value: newValues } : f));
            }
            return [...prev, { id: key, value: newValues }];
        });
    }

    const isFilterApplied = Boolean(filterValue);

    const currentValues = Array.isArray(filterValue) ? (filterValue as string[]) : [];

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {fieldTitle} {isFilterApplied ? "●" : ""}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    {fieldData.options?.map((option) => (
                        <DropdownMenuCheckboxItem key={option} checked={currentValues.includes(option)} onCheckedChange={(checked) => handleCheckboxChange(fieldKey, option, checked)} onSelect={(e) => e.preventDefault()}>
                            {option}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}

function DateFilter<TData>({ table, fieldKey, fieldTitle, filterValue }: FilterItemProps<TData>) {
    const { t } = useTranslation();
    function handleDateChange(key: string, date: Date | undefined) {
        const newValue = date ? new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString() : "";
        table.setColumnFilters((prev) => {
            const existingFilter = prev.find((f) => f.id === key);
            if (newValue.trim() === "") {
                return prev.filter((f) => f.id !== key);
            }
            if (existingFilter) {
                return prev.map((f) => (f.id === key ? { ...f, value: newValue } : f));
            }
            return [...prev, { id: key, value: newValue }];
        });
    }

    const isFilterApplied = Boolean(filterValue);

    const currentDate = filterValue ? new Date(filterValue as string) : undefined;

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {fieldTitle} {isFilterApplied ? "●" : ""}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <div className="space-y-2 p-2">
                        <Calendar mode="single" selected={currentDate} onSelect={(date) => handleDateChange(fieldKey, date)} initialFocus className="p-0" />
                        {currentDate && (
                            <Button className="w-full" variant="secondary" onClick={() => handleDateChange(fieldKey, undefined)}>
                                {t("clear")}
                            </Button>
                        )}
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}

function NumberFilter<TData>({ table, fieldKey, fieldTitle, filterValue }: FilterItemProps<TData>) {
    const { t } = useTranslation();
    function handleNumberChange(key: string, values: number[]) {
        const newValues: [string, string] = [values[0].toString(), values[1].toString()];
        table.setColumnFilters((prev) => {
            if (newValues[0] === "0" && newValues[1] === "100") {
                return prev.filter((f) => f.id !== key);
            } else {
                const exists = prev.find((f) => f.id === key);
                if (exists) {
                    return prev.map((f) => (f.id === key ? { ...f, value: newValues } : f));
                }
                return [...prev, { id: key, value: newValues }];
            }
        });
    }

    const isFilterApplied = Boolean(filterValue);

    const currentValue: [string, string] = Array.isArray(filterValue) ? (filterValue as [string, string]) : ["0", "100"];
    const hideClearBtn = currentValue[0] === "0" && currentValue[1] === "100";

    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>
                {fieldTitle} {isFilterApplied ? "●" : ""}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
                <DropdownMenuSubContent>
                    <div className="flex min-w-50 flex-col gap-4 p-2">
                        <Label>{t("range")}</Label>
                        <Slider value={[parseInt(currentValue[0], 10), parseInt(currentValue[1], 10)]} max={100} min={0} step={10} minStepsBetweenThumbs={1} onValueChange={(values) => handleNumberChange(fieldKey, values)} />
                        <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-xs font-light italic">
                                {t("min-max", { min: currentValue[0], max: currentValue[1] })}
                            </p>
                            {!hideClearBtn && <Trash className="text-muted-foreground hover:text-foreground size-4" onClick={() => table.setColumnFilters((prev) => prev.filter((f) => f.id !== fieldKey))} />}
                        </div>
                    </div>
                </DropdownMenuSubContent>
            </DropdownMenuPortal>
        </DropdownMenuSub>
    );
}

export default ExclusivesTableFilter;
