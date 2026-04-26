import { Braces, Inbox, Mail } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Switch } from '@/components/ui/switch';
import { useUpdateWorkshop } from '@/hooks/workshop/useUpdateWorkshop';
import { useWorkshopById } from '@/hooks/workshop/useWorkshopById';
import { WorkshopSchema, WorkshopSchemaInitData, WorkshopSchemaType } from '@/services/workshop/Workshop.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type UpdateWorkshopDialogProps = {
    eventId: string;
    workshopId: string;
    onClose: (value: boolean) => void;
};

function UpdateWorkshopDialog({ eventId, workshopId, onClose }: UpdateWorkshopDialogProps) {
    const { t } = useTranslation();
    const { workshop, loading: loadingWorkshop } = useWorkshopById(eventId, workshopId);
    const { updateWorkshop, loading: loadingUpdate } = useUpdateWorkshop(() => onClose(false));

    const form = useForm<WorkshopSchemaType>({ resolver: zodResolver(WorkshopSchema), defaultValues: WorkshopSchemaInitData });

    useEffect(() => {
        if (workshop) form.reset(workshop, { keepDefaultValues: false });
    }, [workshop, form]);

    function onSubmit(values: WorkshopSchemaType) {
        updateWorkshop({ eventId, workshopId, payload: values });
    }

    const loading = loadingWorkshop || loadingUpdate;

    return (
        <Dialog defaultOpen onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("update-workshop")}</DialogTitle>
                    <DialogDescription>{t("update-workshop-description")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-6">
                        <Controller
                            name="publish"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                    <FieldContent>
                                        <FieldLabel htmlFor="workshop-publish">{t("publish")}</FieldLabel>
                                        <FieldDescription>{t("publish-state-workshop-description")}</FieldDescription>
                                    </FieldContent>
                                    <Switch id="workshop-publish" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="titleEN"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-titleEN">{t("title-english")}</FieldLabel>
                                    <Input id="workshop-titleEN" aria-invalid={fieldState.invalid} placeholder={t("placeholder-workshop-title")} dir="ltr" disabled={loading} {...field} />
                                    <FieldDescription>{t("workshop-title-en-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="titleAR"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-titleAR">{t("title-arabic")}</FieldLabel>
                                    <Input id="workshop-titleAR" aria-invalid={fieldState.invalid} placeholder={t("placeholder-workshop-title-ar")} dir="rtl" disabled={loading} {...field} />
                                    <FieldDescription>{t("workshop-title-ar-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="senderEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-senderEmail">{t("sender-email")}</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Mail />
                                        </InputGroupAddon>
                                        <InputGroupInput id="workshop-senderEmail" aria-invalid={fieldState.invalid} placeholder={t("placeholder-sender-email")} disabled={loading} {...field} />
                                    </InputGroup>
                                    <FieldDescription>{t("sender-email-enrollees-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="managerEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-managerEmail">{t("manager-email")}</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Inbox />
                                        </InputGroupAddon>
                                        <InputGroupInput id="workshop-managerEmail" aria-invalid={fieldState.invalid} placeholder={t("placeholder-manager-email")} disabled={loading} {...field} />
                                    </InputGroup>
                                    <FieldDescription>{t("manager-email-approval-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="welcomeTemplateId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-welcomeTemplateId">{t("welcome-email-template")}</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Braces />
                                        </InputGroupAddon>
                                        <InputGroupInput id="workshop-welcomeTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} disabled={loading} {...field} />
                                    </InputGroup>
                                    <FieldDescription>{t("welcome-email-enrollees-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="approvedTemplateId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="workshop-approvedTemplateId">{t("approved-email-template")}</FieldLabel>
                                    <InputGroup>
                                        <InputGroupAddon>
                                            <Braces />
                                        </InputGroupAddon>
                                        <InputGroupInput id="workshop-approvedTemplateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} disabled={loading} {...field} />
                                    </InputGroup>
                                    <FieldDescription>{t("approved-email-enrollees-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                            {t("save")}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateWorkshopDialog;
