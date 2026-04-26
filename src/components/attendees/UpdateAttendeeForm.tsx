import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as z from 'zod';

import FormFieldsDynamicField from '@/components/form-fields/FormFieldsDynamicField';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { useUpdateAttendee } from '@/hooks/attendees/useUpdateAttendee';
import ZodSchemaCreator from '@/lib/ZodSchemaCreator';
import { ZodSchemaInitValues } from '@/lib/ZodSchemaInitValues';
import { FormInputSchemaType } from '@/services/form-fields/FormFields.schemas';
import { zodResolver } from '@hookform/resolvers/zod';

type UpdateAttendeeFormProps = {
    eventId: string;
    attendeeId: string;
    formFields: Record<string, FormInputSchemaType>;
    attendeeData: Record<string, string | number | string[] | Date>;
    successCB: (value: boolean) => void;
};

function UpdateAttendeeForm({ eventId, attendeeId, formFields, attendeeData, successCB }: UpdateAttendeeFormProps) {
    const { t, i18n } = useTranslation();
    const dynamicSchema = ZodSchemaCreator(formFields);

    const initValues = useMemo(() => {
        return ZodSchemaInitValues(formFields, attendeeData);
    }, [formFields, attendeeData]);

    const { updateAttendee, loading } = useUpdateAttendee(() => successCB(true));

    const form = useForm<z.infer<typeof dynamicSchema>>({ resolver: zodResolver(dynamicSchema), defaultValues: initValues });

    function onSubmit(values: z.infer<typeof dynamicSchema>) {
        updateAttendee({ eventId, attendeeId, payload: { data: values } });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-6 px-4 pb-4">
                {Object.entries(formFields).map(([key, item]) => (
                    <Controller
                        key={key}
                        name={key}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="participant-name">
                                    {i18n.language === "en-US" ? item.titleEN : item.titleAR} {item.unique ? <span className="text-muted-foreground font-light italic">({t("unique")})</span> : null}
                                </FieldLabel>
                                <FormFieldsDynamicField item={item} field={field} loading={loading} invalid={fieldState.invalid} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                ))}
                <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                    {t("submit")}
                </Button>
            </FieldGroup>
        </form>
    );
}

export default UpdateAttendeeForm;
