import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useGetEnrolleeById } from '@/hooks/enrollees/useGetEnrolleeById';
import { useUpdateEnrollee } from '@/hooks/enrollees/useUpdateEnrollee';
import { EnrolleeSchema, EnrolleeSchemaInitData, EnrolleeSchemaType } from '@/services/enrollees/Enrollees.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type UpdateEnrolleeDialogProps = {
    eventId: string;
    workshopId: string;
    enrolleeId: string;
    onClose: (value: boolean) => void;
};

function UpdateEnrolleeDialog({ eventId, workshopId, enrolleeId, onClose }: UpdateEnrolleeDialogProps) {
    const { t } = useTranslation();
    const { enrollee, loading: loadingEnrollee } = useGetEnrolleeById(eventId, workshopId, enrolleeId);
    const { updateEnrollee, loading: loadingUpdate } = useUpdateEnrollee(() => onClose(false));

    const form = useForm<EnrolleeSchemaType>({ resolver: zodResolver(EnrolleeSchema), defaultValues: EnrolleeSchemaInitData });

    useEffect(() => {
        if (enrollee) form.reset(enrollee, { keepDefaultValues: false });
    }, [enrollee, form]);

    function onSubmit(values: EnrolleeSchemaType) {
        updateEnrollee({ eventId, workshopId, enrolleeId, payload: values });
    }

    const loading = loadingEnrollee || loadingUpdate;

    return (
        <Dialog defaultOpen onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("update-enrollee")}</DialogTitle>
                    <DialogDescription>{t("update-enrollee-description")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-6">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="enrollee-name">{t("name")}</FieldLabel>
                                    <Input id="enrollee-name" aria-invalid={fieldState.invalid} placeholder={t("placeholder-enrollee-name")} disabled={loading} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="enrollee-email">{t("email")}</FieldLabel>
                                    <Input id="enrollee-email" aria-invalid={fieldState.invalid} placeholder={t("placeholder-email-example")} disabled={loading} {...field} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="enrollee-phone">{t("phone")}</FieldLabel>
                                    <Input id="enrollee-phone" aria-invalid={fieldState.invalid} placeholder={t("placeholder-phone")} disabled={loading} {...field} />
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

export default UpdateEnrolleeDialog;
