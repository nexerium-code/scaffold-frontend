import { ArrowLeft, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormFieldsDynamicFieldView from "@/components/form-fields/FormFieldsDynamicFieldView";
import FormFieldsSheetControl from "@/components/form-fields/FormFieldsSheetControl";
import FormFieldsSidebar from "@/components/form-fields/FormFieldsSidebar";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { FormInputTypes } from "@/lib/enums";
import { cn } from "@/lib/utils";
import { AttendanceFormFieldsExclusivesSchema, AttendanceFormFieldsExclusivesSchemaInitData, AttendanceFormFieldsExclusivesSchemaType } from "@/services/attendance/Attendance.formFields.schemas";
import { AttendanceDataUnion } from "@/services/attendance/Attendance.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateAttendanceFormFieldsExclusivesFormProps = {
    appendData: (data: AttendanceDataUnion) => void;
    goBack: () => void;
    className?: string;
};

function CreateAttendanceFormFieldsExclusivesForm({ appendData, goBack, className }: CreateAttendanceFormFieldsExclusivesFormProps) {
    const { t, i18n } = useTranslation();
    const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | undefined>(undefined);

    const form = useForm<AttendanceFormFieldsExclusivesSchemaType>({
        resolver: zodResolver(AttendanceFormFieldsExclusivesSchema),
        defaultValues: AttendanceFormFieldsExclusivesSchemaInitData
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "formFieldsExclusives"
    });

    function onSubmit(values: AttendanceFormFieldsExclusivesSchemaType) {
        appendData(values);
    }

    function handleFieldRemoval(index: number) {
        if (fields.length === 1) return;
        remove(index);
        setSelectedFieldIndex(undefined);
    }

    const upToDateFormFields = useWatch({ control: form.control, name: "formFieldsExclusives" });
    const selectedFieldType = selectedFieldIndex !== undefined ? upToDateFormFields[selectedFieldIndex]?.type : FormInputTypes.SHORT_TEXT;

    return (
        <SidebarProvider className={cn("flex min-h-0 flex-col gap-0", className)}>
            <header className="flex h-12 shrink-0 items-center gap-2 border-b p-4">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-full" />
                <span className="text-muted-foreground text-sm wrap-break-word">{t("create-attendance-main")}</span>
                <span className="text-muted-foreground text-sm font-semibold wrap-break-word italic">({t("exclusives")})</span>
            </header>
            <form className="flex h-[calc(100vh-3rem)]" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Sidebar - add form fields */}
                <FormFieldsSidebar addField={append} />
                {/* Playground - Start */}
                <SidebarInset className="min-h-0 items-center overflow-x-hidden p-4">
                    <FieldSet className="w-full max-w-xl">
                        <Controller
                            name="formFieldsExclusives"
                            control={form.control}
                            render={({ field: _field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel>{t("form-fields")}</FieldLabel>
                                        <FieldDescription>{t("add-or-remove-form-fields")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </FieldContent>
                                </Field>
                            )}
                        />
                        {fields.map((item, index) => (
                            <Controller
                                key={item.id}
                                name={`formFieldsExclusives.${index}`}
                                control={form.control}
                                render={({ field: _field, fieldState }) => (
                                    <Field orientation="horizontal" className="items-end! gap-2" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel>{i18n.language === "en-US" && (upToDateFormFields[index]?.titleEN || upToDateFormFields[index]?.titleAR || t("untitled"))}</FieldLabel>
                                            <FieldLabel>{i18n.language === "ar-SA" && (upToDateFormFields[index]?.titleAR || upToDateFormFields[index]?.titleEN || t("untitled"))}</FieldLabel>
                                            <FormFieldsDynamicFieldView field={upToDateFormFields[index]} invalid={fieldState.invalid} />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Button type="button" variant="secondary" size="icon" onClick={() => setSelectedFieldIndex(index)}>
                                            <Pencil />
                                        </Button>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => handleFieldRemoval(index)} disabled={item.type === FormInputTypes.EMAIL}>
                                            <Trash />
                                        </Button>
                                    </Field>
                                )}
                            />
                        ))}
                        <FieldSeparator />
                        <Field orientation="horizontal">
                            <Button type="button" variant="outline" className="flex-1" onClick={goBack}>
                                <ArrowLeft />
                                {t("back")}
                            </Button>
                            <Button type="submit" className="flex-1" disabled={!form.formState.isValid}>
                                {t("submit")}
                            </Button>
                        </Field>
                    </FieldSet>
                </SidebarInset>
                {/* Sheet - form fields customization */}
                {selectedFieldIndex !== undefined && <FormFieldsSheetControl key={`formFieldsSheetControl-${selectedFieldIndex}`} control={form.control as never} pathName="formFieldsExclusives" activeIndex={selectedFieldIndex} type={selectedFieldType} onClose={() => setSelectedFieldIndex(undefined)} />}
            </form>
        </SidebarProvider>
    );
}

export default CreateAttendanceFormFieldsExclusivesForm;
