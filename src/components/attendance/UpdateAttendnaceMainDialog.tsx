import { format } from "date-fns";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CalendarIcon, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUpdateAttendanceMain } from "@/hooks/attendance/useUpdateAttendanceMain";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { AttendanceTypes, EntryPolicyTypes } from "@/lib/enums";
import { toUTC } from "@/lib/utils";
import { initAttendanceMainData, prepareAttendanceMainData } from "@/services/attendance/Attendance.helpers";
import { AttendanceMainSchema, AttendanceMainSchemaType } from "@/services/attendance/Attendance.main.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function UpdateAttendanceMainDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { attendance } = useUserAttendance(selectedEvent);
    const [open, setOpen] = useState(false);
    const { updateAttendanceMain, loading } = useUpdateAttendanceMain(() => setOpen(false));

    const form = useForm<AttendanceMainSchemaType>({ resolver: zodResolver(AttendanceMainSchema) });

    useEffect(() => {
        if (attendance) form.reset(initAttendanceMainData(attendance), { keepDefaultValues: false });
    }, [attendance, form]);

    const {
        fields: datesFields,
        append: appendDates,
        remove: removeDates
    } = useFieldArray({
        control: form.control,
        name: "dates"
    });

    const {
        fields: categoriesFields,
        append: appendCategories,
        remove: removeCategories
    } = useFieldArray({
        control: form.control,
        name: "categories"
    });

    function onSubmit(values: AttendanceMainSchemaType) {
        const prepareData = prepareAttendanceMainData(values);
        updateAttendanceMain({ eventId: selectedEvent, payload: prepareData });
    }

    function handleAddCategory() {
        appendCategories({ name: "", price: "" });
    }

    function handleAddDate() {
        appendDates({ value: undefined, active: true } as never);
    }

    function resetState() {
        form.reset();
    }

    const attendanceType = useWatch({ control: form.control, name: "type" });
    const showCategories = attendanceType === AttendanceTypes.PAID;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {t("edit")} <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="inset-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-none p-0 sm:max-w-none rtl:translate-x-0">
                <VisuallyHidden>
                    <DialogTitle>{t("update-attendance-dialog")}</DialogTitle>
                    <DialogDescription>{t("update-attendance-dialog")}</DialogDescription>
                </VisuallyHidden>
                <div className="flex flex-1 flex-col overflow-auto">
                    <h3 className="w-max px-4 text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</h3>{" "}
                    <form className="flex flex-1 items-center justify-center p-2 pt-0" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="max-w-xl gap-6">
                            <FieldSet>
                                <FieldLegend>{t("update-attendance-main")}</FieldLegend>
                                <FieldDescription>{t("update-attendance-main-description")}</FieldDescription>
                                <Controller
                                    name="publish"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-publish">{t("publish-state")}</FieldLabel>
                                                <FieldDescription>{t("publish-state-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Switch id="attendance-publish" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="type"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-type">{t("type")}</FieldLabel>
                                                <FieldDescription>{t("type-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                                                <SelectTrigger id="attendance-type" aria-invalid={fieldState.invalid} className="min-w-46">
                                                    <SelectValue placeholder={t("placeholder-select-type")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={AttendanceTypes.FREE}>{AttendanceTypes.FREE}</SelectItem>
                                                    <SelectItem value={AttendanceTypes.PAID}>{AttendanceTypes.PAID}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="entryPolicy"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-entryPolicy">{t("entry-policy")}</FieldLabel>
                                                <FieldDescription>{t("entry-policy-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Select defaultValue={field.value} onValueChange={field.onChange} {...field}>
                                                <SelectTrigger id="attendance-entryPolicy" aria-invalid={fieldState.invalid} className="min-w-46">
                                                    <SelectValue placeholder={t("placeholder-select-type")} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value={EntryPolicyTypes.SINGLE}>{EntryPolicyTypes.SINGLE}</SelectItem>
                                                    <SelectItem value={EntryPolicyTypes.MULTIPLE}>{EntryPolicyTypes.MULTIPLE}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="senderEmail"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-senderEmail">{t("sender-email")}</FieldLabel>
                                                <FieldDescription className="text-balance">{t("sender-email-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Input id="attendance-senderEmail" aria-invalid={fieldState.invalid} type="email" placeholder={t("placeholder-sender-email")} {...field} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="welcomeTemplateId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-welcomeTemplateId">{t("welcome-email-template")}</FieldLabel>
                                                <FieldDescription className="text-balance">{t("welcome-email-template-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Input id="attendance-welcomeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} {...field} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="attendeesBadgeTemplateId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-attendeesBadgeTemplateId">{t("attendees-badge-template")}</FieldLabel>
                                                <FieldDescription className="text-balance">{t("attendees-badge-template-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Input id="attendance-attendeesBadgeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id-short")} {...field} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="exclusivesBadgeTemplateId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-exclusivesBadgeTemplateId">{t("exclusives-badge-template")}</FieldLabel>
                                                <FieldDescription className="text-balance">{t("exclusives-badge-template-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <Input id="attendance-exclusivesBadgeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id-short")} {...field} />
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="code"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                            <FieldContent>
                                                <FieldLabel htmlFor="attendance-code">{t("code")}</FieldLabel>
                                                <FieldDescription className="text-balance">{t("code-description")}</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldContent>
                                            <InputOTP id="attendance-code" aria-invalid={fieldState.invalid} maxLength={6} pattern={REGEXP_ONLY_DIGITS} dir="ltr" {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                </InputOTPGroup>
                                                <InputOTPSeparator />
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </Field>
                                    )}
                                />
                            </FieldSet>
                            <FieldSeparator />
                            <FieldSet>
                                <FieldLegend>{t("attendance-dates")}</FieldLegend>
                                <FieldDescription>{t("attendance-dates-description")}</FieldDescription>
                                <FieldGroup className="bg-muted/20 max-h-60 gap-4 overflow-y-auto rounded-md border p-4">
                                    <Button type="button" variant="secondary" onClick={handleAddDate}>
                                        {t("add-date")}
                                    </Button>
                                    {datesFields.map((date, index) => (
                                        <Controller
                                            key={date.id}
                                            name={`dates.${index}`}
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field>
                                                    <InputGroup>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <InputGroupAddon aria-invalid={fieldState.invalid} align="inline-start" className="w-full justify-start">
                                                                    <InputGroupButton type="button" variant="link" className="font-normal">
                                                                        <CalendarIcon />
                                                                        {field.value?.value ? `${format(field.value.value, "P")}` : <span className="text-muted-foreground">{t("select-date")}</span>}
                                                                    </InputGroupButton>
                                                                </InputGroupAddon>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar mode="single" selected={field.value?.value} onSelect={(date) => field.onChange({ value: toUTC(date), active: field.value?.active ?? true })} />
                                                            </PopoverContent>
                                                        </Popover>
                                                        <InputGroupAddon align="inline-end">
                                                            <Switch checked={field.value?.active} onCheckedChange={(active) => field.onChange({ value: field.value?.value, active })} />
                                                        </InputGroupAddon>
                                                        <InputGroupAddon align="inline-end">
                                                            <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => removeDates(index)}>
                                                                <X />
                                                            </InputGroupButton>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </Field>
                                            )}
                                        />
                                    ))}
                                    {form.formState.errors?.dates?.root && <FieldError errors={[form.formState.errors.dates.root]} />}
                                </FieldGroup>
                            </FieldSet>
                            {showCategories && (
                                <FieldSet>
                                    <FieldLegend>{t("attendance-categories")}</FieldLegend>
                                    <FieldDescription>{t("attendance-categories-description")}</FieldDescription>
                                    <FieldGroup className="bg-muted/20 max-h-60 gap-4 overflow-y-auto rounded-md border p-4">
                                        <Button type="button" variant="secondary" onClick={handleAddCategory}>
                                            {t("add-category")}
                                        </Button>
                                        {categoriesFields.map((category, index) => (
                                            <Controller
                                                key={category.id}
                                                name={`categories.${index}`}
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field>
                                                        <InputGroup>
                                                            <InputGroupInput aria-invalid={fieldState.invalid} type="text" placeholder={t("placeholder-name")} className="border-e" value={field.value?.name} onChange={(e) => field.onChange({ name: e.target.value, price: field.value?.price })} />
                                                            <InputGroupInput aria-invalid={fieldState.invalid} type="number" placeholder={t("placeholder-price")} value={field.value?.price} onChange={(e) => field.onChange({ name: field.value?.name, price: e.target.value })} />
                                                            <InputGroupAddon align="inline-end">
                                                                <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => removeCategories(index)}>
                                                                    <X />
                                                                </InputGroupButton>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />
                                        ))}
                                        {"categories" in form.formState.errors && <FieldError errors={[form.formState.errors.categories]} />}
                                    </FieldGroup>
                                </FieldSet>
                            )}
                            <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                                {t("save")}
                            </Button>
                        </FieldGroup>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateAttendanceMainDialog;
