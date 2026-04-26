import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import FormFieldsDynamicField from "@/components/form-fields/FormFieldsDynamicField";
import ProfilePic from "@/components/general/ProfilePic";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useCreateExclusive } from "@/hooks/exclusives/useCreateExclusive";
import ZodSchemaCreator from "@/lib/ZodSchemaCreator";
import { ZodSchemaDefaultValues } from "@/lib/ZodSchemaDefaultValues";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateExclusiveFormProps = {
    eventId: string;
    formFields: Record<string, FormInputSchemaType>;
    onSuccess: () => void;
};

function CreateExclusiveForm({ eventId, formFields, onSuccess }: CreateExclusiveFormProps) {
    const { t, i18n } = useTranslation();
    const dynamicSchema = useMemo(
        () =>
            ZodSchemaCreator(formFields).extend({
                picture: z.custom(
                    (value) => {
                        if (value === undefined) return true;
                        if (value instanceof File || typeof value === "string") return true;
                        return false;
                    },
                    { error: "invalid-image" }
                )
            }),
        [formFields]
    );

    const initValues = useMemo(() => {
        const defaultValues = ZodSchemaDefaultValues(formFields);
        return { ...defaultValues, picture: undefined };
    }, [formFields]);

    const { createExclusive, loading } = useCreateExclusive(() => onSuccess());

    const form = useForm<z.infer<typeof dynamicSchema>>({ resolver: zodResolver(dynamicSchema), defaultValues: initValues });

    function onSubmit(values: z.infer<typeof dynamicSchema>) {
        const { picture, ...data } = values;
        createExclusive({ eventId, payload: { picture: picture as File | string, data } });
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-6">
                <Controller
                    name="picture"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field orientation="horizontal" className="items-end!" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel>{t("picture")}</FieldLabel>
                                <FieldDescription>{t("picture-description")}</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </FieldContent>
                            <ProfilePic image={field.value as string | File | undefined} setImage={(value) => field.onChange(value)} />
                        </Field>
                    )}
                />
                {Object.entries(formFields).map(([key, item]) => (
                    <Controller
                        key={key}
                        name={key}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={item.titleEN}>
                                    {i18n.language === "en-US" ? item.titleEN : item.titleAR} {item.unique ? <span className="text-muted-foreground font-light italic">({t("unique")})</span> : null}
                                </FieldLabel>
                                <FormFieldsDynamicField item={item} field={field} loading={loading} invalid={fieldState.invalid} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                ))}
                <Button type="submit" disabled={loading || !form.formState.isValid}>
                    {t("submit")}
                </Button>
            </FieldGroup>
        </form>
    );
}

export default CreateExclusiveForm;
