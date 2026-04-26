import { Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUpdateProvision } from "@/hooks/provision/useUpdateProvision";
import { useUserProvision } from "@/hooks/provision/useUserProvision";
import { ProvisionSchema, ProvisionSchemaInitData, ProvisionSchemaType } from "@/services/provision/Provision.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function UpdateProvisionDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { provision } = useUserProvision(selectedEvent);
    const [open, setOpen] = useState(false);
    const { updateProvision, loading } = useUpdateProvision(() => setOpen(false));

    const form = useForm<ProvisionSchemaType>({ resolver: zodResolver(ProvisionSchema), defaultValues: ProvisionSchemaInitData });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "references" as never
    });

    useEffect(() => {
        if (provision) form.reset(provision, { keepDefaultValues: false });
    }, [provision, form]);

    function onSubmit(values: ProvisionSchemaType) {
        updateProvision({ eventId: selectedEvent, payload: values });
    }

    function handleAdd() {
        append(`R${fields.length + 1}` as never);
    }

    function handleRemove(index: number) {
        if (fields.length === 1) return;
        remove(index);
    }

    function resetState() {
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {t("edit")} <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="inset-0 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-auto rounded-none border-none p-0 sm:max-w-none rtl:translate-x-0">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>{t("update-provision-dialog")}</DialogTitle>
                        <DialogDescription>{t("update-provision-dialog")}</DialogDescription>
                    </VisuallyHidden>
                    <h3 className="w-max px-4 text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</h3>
                </DialogHeader>
                <form className="flex flex-1 items-center justify-center p-2 pt-0" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="max-w-xl gap-6">
                        <FieldSet>
                            <FieldLegend>{t("update-provision-main")}</FieldLegend>
                            <FieldDescription>{t("update-provision-main-description")}</FieldDescription>
                            <Controller
                                name="publish"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-publish">{t("publish-state")}</FieldLabel>
                                            <FieldDescription>{t("publish-state-provision-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Switch id="provision-publish" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="senderEmail"
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-senderEmail">{t("sender-email")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("sender-email-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="provision-senderEmail" aria-invalid={fieldState.invalid} type="email" placeholder={t("placeholder-sender-email")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="managerEmail"
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-managerEmail">{t("manager-email")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("manager-email-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="provision-managerEmail" aria-invalid={fieldState.invalid} type="email" placeholder={t("placeholder-manager-email")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="welcomeTemplateId"
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-welcomeTemplateId">{t("welcome-email-template")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("welcome-email-template-participants-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="provision-welcomeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Controller
                                control={form.control}
                                name="approvedTemplateId"
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-approvedTemplateId">{t("approved-email-template")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("approved-email-template-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="provision-approvedTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="badgeTemplateId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="provision-badgeTemplateId">{t("badge-template")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("badge-template-staff-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="provision-badgeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id-short")} {...field} />
                                    </Field>
                                )}
                            />
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>{t("provision-references")}</FieldLegend>
                            <FieldDescription>{t("provision-references-description")}</FieldDescription>
                            <FieldGroup className="bg-muted/20 max-h-60 gap-4 overflow-y-auto rounded-md border p-4">
                                <Button type="button" variant="secondary" onClick={handleAdd} disabled={loading}>
                                    {t("add-reference-code")}
                                </Button>
                                {fields.map((reference, referenceIndex) => (
                                    <Controller
                                        key={reference.id}
                                        name={`references.${referenceIndex}`}
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <InputGroup>
                                                    <InputGroupInput id={`provision-array-reference-${referenceIndex}`} aria-invalid={fieldState.invalid} placeholder={t("placeholder-reference")} {...field} />
                                                    <InputGroupAddon align="inline-end">
                                                        <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => handleRemove(referenceIndex)}>
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
                            {form.formState.errors?.references && <FieldError errors={[form.formState.errors.references]} />}
                        </FieldSet>
                        <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                            {t("submit")}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateProvisionDialog;
