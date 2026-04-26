import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateEnrollee } from '@/hooks/enrollees/useCreateEnrollee';
import { EnrolleeSchema, EnrolleeSchemaInitData, EnrolleeSchemaType } from '@/services/enrollees/Enrollees.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type CreateEnrolleeDialogProps = {
    eventId: string;
    workshopId: string;
};

function CreateEnrolleeDialog({ eventId, workshopId }: CreateEnrolleeDialogProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const form = useForm<EnrolleeSchemaType>({ resolver: zodResolver(EnrolleeSchema), defaultValues: EnrolleeSchemaInitData });
    const { createEnrollee, loading } = useCreateEnrollee(() => setOpen(false));

    function onSubmit(values: EnrolleeSchemaType) {
        createEnrollee({ eventId, workshopId, payload: values });
    }

    function resetState() {
        form.reset(EnrolleeSchemaInitData);
    }

    return (
        <Tooltip>
            <Dialog open={open} onOpenChange={setOpen}>
                <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                            <PlusCircle />
                        </Button>
                    </DialogTrigger>
                </TooltipTrigger>
                <DialogContent onCloseAutoFocus={resetState}>
                <DialogHeader>
                    <DialogTitle>{t("create-enrollee")}</DialogTitle>
                    <DialogDescription>{t("create-enrollee-description")}</DialogDescription>
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
                        <Button type="submit" disabled={loading || !form.formState.isValid}>
                            Submit
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
            </Dialog>
            <TooltipContent>{t("create-enrollee")}</TooltipContent>
        </Tooltip>
    );
}

export default CreateEnrolleeDialog;
