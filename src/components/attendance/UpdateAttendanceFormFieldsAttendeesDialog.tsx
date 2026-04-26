import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import FormFieldsDynamicFieldView from "@/components/form-fields/FormFieldsDynamicFieldView";
import FormFieldsSheetControl from "@/components/form-fields/FormFieldsSheetControl";
import FormFieldsSidebar from "@/components/form-fields/FormFieldsSidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUpdateAttendanceFormFieldsAttendees } from "@/hooks/attendance/useUpdateAttendanceFormFieldsAttendees";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { FormInputTypes } from "@/lib/enums";
import { AttendanceFormFieldsAttendeesSchema, AttendanceFormFieldsAttendeesSchemaType } from "@/services/attendance/Attendance.formFields.schemas";
import { initAttendanceFormFieldsAttendeesData, prepareAttendanceFormFieldsAttendeesData } from "@/services/attendance/Attendance.helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function UpdateAttendanceFormFieldsAttendeesDialog() {
    const { t, i18n } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);

    const [open, setOpen] = useState(false);
    const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | undefined>(undefined);

    const { updateAttendanceFormFieldsAttendees, loading } = useUpdateAttendanceFormFieldsAttendees(() => setOpen(false));

    const form = useForm<AttendanceFormFieldsAttendeesSchemaType>({
        resolver: zodResolver(AttendanceFormFieldsAttendeesSchema)
    });

    useEffect(() => {
        if (attendance) form.reset(initAttendanceFormFieldsAttendeesData(attendance), { keepDefaultValues: false });
    }, [attendance, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "formFieldsAttendees"
    });

    function onSubmit(values: AttendanceFormFieldsAttendeesSchemaType) {
        const prepareData = prepareAttendanceFormFieldsAttendeesData(values);
        updateAttendanceFormFieldsAttendees({ eventId: selectedEvent, payload: prepareData });
    }

    function handleFieldRemoval(index: number) {
        if (fields.length === 1) return;
        remove(index);
        setSelectedFieldIndex(undefined);
    }

    function resetState() {
        form.reset();
        setSelectedFieldIndex(undefined);
    }

    const upToDateFormFields = useWatch({ control: form.control, name: "formFieldsAttendees" });
    const selectedFieldType = selectedFieldIndex !== undefined ? upToDateFormFields[selectedFieldIndex]?.type : FormInputTypes.SHORT_TEXT;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {t("form")} <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="inset-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-none p-0 sm:max-w-none rtl:translate-x-0">
                <VisuallyHidden>
                    <DialogTitle>{t("update-form-fields-dialog")}</DialogTitle>
                    <DialogDescription>{t("update-form-fields-dialog")}</DialogDescription>
                </VisuallyHidden>
                <SidebarProvider className="flex min-h-0 flex-col gap-0">
                    <header className="flex h-12 shrink-0 items-center gap-2 border-b p-4">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="h-full" />
                        <span className="text-muted-foreground text-sm wrap-break-word">{t("update-attendees-form")}</span>
                    </header>
                    <form className="flex h-[calc(100vh-3rem)]" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Sidebar - add form fields */}
                        <FormFieldsSidebar addField={append} />
                        {/* Playground - Start */}
                        <SidebarInset className="min-h-0 items-center overflow-x-hidden p-4">
                            <FieldSet className="w-full max-w-xl">
                                <Controller
                                    name="formFieldsAttendees"
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
                                <FieldSeparator />
                                {fields.map((item, index) => (
                                    <Controller
                                        key={item.id}
                                        name={`formFieldsAttendees.${index}`}
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
                                <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                                    {t("save")}
                                </Button>
                            </FieldSet>
                        </SidebarInset>
                        {/* Sheet - form fields customization */}
                        {selectedFieldIndex !== undefined && <FormFieldsSheetControl key={`formFieldsSheetControl-${selectedFieldIndex}`} control={form.control as never} pathName="formFieldsAttendees" activeIndex={selectedFieldIndex} type={selectedFieldType} onClose={() => setSelectedFieldIndex(undefined)} />}
                    </form>
                </SidebarProvider>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateAttendanceFormFieldsAttendeesDialog;
