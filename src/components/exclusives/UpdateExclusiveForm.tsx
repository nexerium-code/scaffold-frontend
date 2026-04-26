import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";

import FormFieldsDynamicField from "@/components/form-fields/FormFieldsDynamicField";
import ProfilePic from "@/components/general/ProfilePic";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useUpdateExclusive } from "@/hooks/exclusives/useUpdateExclusive";
import ZodSchemaCreator from "@/lib/ZodSchemaCreator";
import { ZodSchemaInitValues } from "@/lib/ZodSchemaInitValues";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type UpdateExclusiveFormProps = {
    eventId: string;
    exclusiveId: string;
    formFields: Record<string, FormInputSchemaType>;
    exclusivePicture: string;
    exclusiveData: Record<string, string | number | string[] | Date>;
    successCB: (value: boolean) => void;
};

function UpdateExclusiveForm({ eventId, exclusiveId, formFields, exclusivePicture, exclusiveData, successCB }: UpdateExclusiveFormProps) {
    const { t } = useTranslation();

    const dynamicSchema = useMemo(
        () =>
            ZodSchemaCreator(formFields).extend({
                picture: z.custom(
                    (value) => {
                        if (value instanceof File || typeof value === "string") return true;
                        return false;
                    },
                    { error: "invalid-image" }
                )
            }),
        [formFields]
    );

    const initValues = useMemo(() => {
        const values = ZodSchemaInitValues(formFields, exclusiveData);
        return { ...values, picture: exclusivePicture };
    }, [formFields, exclusiveData, exclusivePicture]);

    const { updateExclusive, loading } = useUpdateExclusive(() => successCB(true));

    const form = useForm<z.infer<typeof dynamicSchema>>({ resolver: zodResolver(dynamicSchema), defaultValues: initValues });

    function onSubmit(values: z.infer<typeof dynamicSchema>) {
        const { picture, ...data } = values;
        updateExclusive({ eventId, exclusiveId, payload: { picture: picture as File | string, data } });
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
                                <FieldLabel htmlFor="participant-name">
                                    {item.titleEN} {item.unique ? <span className="text-muted-foreground font-light italic">(Unique)</span> : null}
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

export default UpdateExclusiveForm;
