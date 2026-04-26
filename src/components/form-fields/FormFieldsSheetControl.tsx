import { X } from "lucide-react";
import { Control, Controller, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CanBeUnique, FormInputType, FormInputTypes, MustHaveOptions } from "@/lib/enums";

type FormFieldsSheetControlProps = {
    control: Control;
    pathName: string;
    activeIndex: number;
    type: FormInputType;
    onClose: () => void;
};

function FormFieldsSheetControl({ control, pathName, activeIndex, type, onClose }: FormFieldsSheetControlProps) {
    const { t, i18n } = useTranslation();

    const {
        fields: options,
        append: appendOption,
        remove: removeOption
    } = useFieldArray({
        control,
        name: `${pathName}.${activeIndex}.options` as never
    });

    function handleAdd() {
        appendOption(`OP${options.length + 1}` as never);
    }

    function handleRemove(index: number) {
        if (options.length === 2) return;
        removeOption(index);
    }

    return (
        <Sheet defaultOpen onOpenChange={onClose}>
            <SheetContent side={i18n.language === "en-US" ? "right" : "left"} className="max-h-svh overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{t("customize-field")}</SheetTitle>
                    <SheetDescription>
                        {t("customize-field-description", { type })}
                    </SheetDescription>
                </SheetHeader>
                <FieldGroup className="flex-1 p-4">
                    <Controller
                        name={`${pathName}.${activeIndex}.titleEN` as never}
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="FormFieldsSheetControl-titleEN">{t("title-english")}</FieldLabel>
                                <Input id="FormFieldsSheetControl-titleEN" aria-invalid={fieldState.invalid} placeholder={t("placeholder-field-name")} className="bg-background" dir="ltr" {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name={`${pathName}.${activeIndex}.titleAR` as never}
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="FormFieldsSheetControl-titleAR">{t("title-arabic")}</FieldLabel>
                                <Input id="FormFieldsSheetControl-titleAR" aria-invalid={fieldState.invalid} placeholder={t("placeholder-field-name-ar")} className="bg-background" dir="rtl" {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name={`${pathName}.${activeIndex}.required` as never}
                        control={control}
                        render={({ field }) => (
                            <Field orientation="horizontal" className="bg-background rounded-md border p-2">
                                <Checkbox id="FormFieldsSheetControl-required" checked={field.value} onCheckedChange={field.onChange} disabled={FormInputTypes.EMAIL === type} />
                                <FieldContent>
                                    <FieldLabel htmlFor="FormFieldsSheetControl-required">{t("required")}</FieldLabel>
                                    <FieldDescription>{t("required-description")}</FieldDescription>
                                </FieldContent>
                            </Field>
                        )}
                    />
                    <Controller
                        name={`${pathName}.${activeIndex}.unique` as never}
                        control={control}
                        render={({ field }) => (
                            <Field orientation="horizontal" className="bg-background rounded-md border p-2">
                                <Checkbox id="FormFieldsSheetControl-unique" checked={field.value} onCheckedChange={field.onChange} disabled={!CanBeUnique.has(type)} />
                                <FieldContent>
                                    <FieldLabel htmlFor="FormFieldsSheetControl-unique">{t("unique")}</FieldLabel>
                                    <FieldDescription>{t("unique-description")}</FieldDescription>
                                </FieldContent>
                            </Field>
                        )}
                    />
                    {MustHaveOptions.has(type) && (
                        <FieldSet>
                            <FieldLegend>{t("field-options")}</FieldLegend>
                            <FieldDescription>{t("field-options-description")}</FieldDescription>
                            <FieldGroup className="max-h-60 gap-2 overflow-y-auto rounded-md border p-2">
                                <Button type="button" variant="secondary" onClick={handleAdd}>
                                    {t("add-option")}
                                </Button>
                                {options.map((option, optionIndex) => (
                                    <Controller
                                        key={option.id}
                                        name={`${pathName}.${activeIndex}.options.${optionIndex}`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <InputGroup>
                                                    <InputGroupInput aria-invalid={fieldState.invalid} placeholder={t("placeholder-option")} {...field} />
                                                    <InputGroupAddon align="inline-end">
                                                        <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => handleRemove(optionIndex)}>
                                                            <X />
                                                        </InputGroupButton>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                ))}
                            </FieldGroup>
                        </FieldSet>
                    )}
                </FieldGroup>
            </SheetContent>
        </Sheet>
    );
}

export default FormFieldsSheetControl;
