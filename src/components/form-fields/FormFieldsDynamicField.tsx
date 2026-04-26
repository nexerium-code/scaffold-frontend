import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormInputTypes } from "@/lib/enums";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

type FormFieldsDynamicFieldProps = {
    item: FormInputSchemaType;
    field: ControllerRenderProps;
    loading: boolean;
    invalid: boolean;
};

function FormFieldsDynamicField({ item, field, loading, invalid }: FormFieldsDynamicFieldProps) {
    const { t } = useTranslation();

    if (item.type === FormInputTypes.EMAIL) {
        return <Input id={item.titleEN} type="email" placeholder={t("placeholder-email-example")} aria-invalid={invalid} disabled={loading} {...field} />;
    }

    if (item.type === FormInputTypes.SHORT_TEXT) {
        return <Input id={item.titleEN} type="text" placeholder={t("placeholder-enter-answer")} aria-invalid={invalid} disabled={loading} {...field} />;
    }

    if (item.type === FormInputTypes.LONG_TEXT) {
        return <Textarea id={item.titleEN} placeholder={t("placeholder-enter-answer")} aria-invalid={invalid} disabled={loading} {...field} />;
    }

    if (item.type === FormInputTypes.LINK) {
        return <Input id={item.titleEN} type="url" placeholder={t("placeholder-url-example")} aria-invalid={invalid} disabled={loading} {...field} />;
    }

    if (item.type === FormInputTypes.NUMBER) {
        return (
            <Input
                id={item.titleEN}
                type="number"
                placeholder={t("placeholder-number")}
                aria-invalid={invalid}
                disabled={loading}
                value={field.value}
                onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === "") {
                        field.onChange(undefined);
                    } else {
                        field.onChange(Number(inputValue));
                    }
                }}
            />
        );
    }

    if (item.type === FormInputTypes.PHONE) {
        return <Input id={item.titleEN} type="tel" placeholder={t("placeholder-phone")} aria-invalid={invalid} disabled={loading} {...field} />;
    }

    if (item.type === FormInputTypes.CHECKBOX) {
        return (
            <FieldGroup className="gap-2">
                {item.options?.map((option, index) => (
                    <Field key={`${item.titleEN}-${item.type}-${option}-${index}`} orientation="horizontal" data-invalid={invalid}>
                        <Checkbox
                            id={`${item.titleEN}-${item.type}-${option}-${index}`}
                            name={option}
                            aria-invalid={invalid}
                            checked={Array.isArray(field.value) && field.value.includes(option)}
                            onCheckedChange={(checked) => {
                                if (checked === true) {
                                    const newValue = Array.isArray(field.value) ? [...field.value, option] : [option];
                                    field.onChange(newValue);
                                } else {
                                    const newValue = Array.isArray(field.value) ? field.value.filter((v: string) => v !== option) : [];
                                    field.onChange(newValue);
                                }
                            }}
                            disabled={loading}
                        />
                        <FieldLabel htmlFor={`${item.titleEN}-${item.type}-${option}-${index}`} className="font-normal">
                            {option}
                        </FieldLabel>
                    </Field>
                ))}
            </FieldGroup>
        );
    }

    if (item.type === FormInputTypes.RADIO) {
        return (
            <RadioGroup name={item.titleEN} value={field.value} onValueChange={field.onChange} aria-invalid={invalid} disabled={loading} className="gap-2">
                {item.options?.map((option, index) => (
                    <Field key={`${item.titleEN}-${item.type}-${option}-${index}`} orientation="horizontal" data-invalid={invalid}>
                        <RadioGroupItem id={`${item.titleEN}-${item.type}-${option}-${index}`} aria-invalid={invalid} value={option} disabled={loading} />
                        <FieldLabel htmlFor={`${item.titleEN}-${item.type}-${option}-${index}`} className="font-normal">
                            {option}
                        </FieldLabel>
                    </Field>
                ))}
            </RadioGroup>
        );
    }

    if (item.type === FormInputTypes.SELECT) {
        return (
            <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading} {...field}>
                <SelectTrigger id={item.titleEN} aria-invalid={invalid}>
                    <SelectValue placeholder={t("placeholder-select-dots")} />
                </SelectTrigger>
                <SelectContent>
                    {item.options?.map((el, index) => (
                        <SelectItem key={item.titleEN + item.type + el + index} value={el}>
                            {el}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }

    if (item.type === FormInputTypes.DATE) {
        const selectedDate = field.value ? new Date(`${field.value}T00:00:00`) : undefined;
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button id={item.titleEN} type="button" variant="outline" aria-invalid={invalid} disabled={loading}>
                        {selectedDate ? <span className="truncate font-normal">{format(selectedDate, "P")}</span> : <span className="text-muted-foreground truncate font-normal">{t("select-date")}</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={selectedDate} onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)} />
                </PopoverContent>
            </Popover>
        );
    }
}

export default FormFieldsDynamicField;
