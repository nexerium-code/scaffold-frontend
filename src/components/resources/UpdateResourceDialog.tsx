import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useResourceById } from "@/hooks/resources/useResourceById";
import { useUpdateResource } from "@/hooks/resources/useUpdateResource";
import { ResourceStatusTypes } from "@/lib/enums";
import { ResourceSchema, ResourceSchemaInitData, ResourceSchemaType } from "@/services/resources/Resources.schemas";

type UpdateResourceDialogProps = {
    onOpenChange: (open: boolean) => void;
    open: boolean;
    resourceId: string;
    scopeId: string;
};

function UpdateResourceDialog({ onOpenChange, open, resourceId, scopeId }: UpdateResourceDialogProps) {
    const { t } = useTranslation();
    const form = useForm<ResourceSchemaType>({ resolver: zodResolver(ResourceSchema), defaultValues: ResourceSchemaInitData, mode: "onChange" });
    const { resource, loading: loadingResource } = useResourceById(scopeId, resourceId, open);
    const { updateResource, loading } = useUpdateResource(() => onOpenChange(false));

    useEffect(() => {
        if (resource) {
            form.reset(
                {
                    description: resource.description || "",
                    name: resource.name,
                    ownerEmail: resource.ownerEmail,
                    status: resource.status
                },
                { keepDefaultValues: false }
            );
        }
    }, [form, resource]);

    function onSubmit(values: ResourceSchemaType) {
        updateResource({ scopeId, resourceId, payload: values });
    }

    const disabled = loading || loadingResource;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("update-resource")}</DialogTitle>
                    <DialogDescription>{t("update-resource-description")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="resource-name-update">{t("name")}</FieldLabel>
                                    <Input id="resource-name-update" aria-invalid={fieldState.invalid} placeholder={t("name-placeholder")} disabled={disabled} {...field} />
                                    <FieldDescription>{t("resource-name-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="ownerEmail"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="resource-owner-email-update">{t("owner-email")}</FieldLabel>
                                    <Input id="resource-owner-email-update" aria-invalid={fieldState.invalid} type="email" placeholder={t("owner-email-placeholder")} disabled={disabled} {...field} />
                                    <FieldDescription>{t("owner-email-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="status"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="resource-status-update">{t("status")}</FieldLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                                        <SelectTrigger id="resource-status-update" aria-invalid={fieldState.invalid} className="w-full">
                                            <SelectValue placeholder={t("select-status")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.values(ResourceStatusTypes).map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {t(status)}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FieldDescription>{t("resource-status-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="resource-description-update">{t("description")}</FieldLabel>
                                    <Textarea id="resource-description-update" aria-invalid={fieldState.invalid} placeholder={t("description-placeholder")} disabled={disabled} {...field} />
                                    <FieldDescription>{t("resource-description")}</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Button type="submit" disabled={disabled || !form.formState.isValid || !form.formState.isDirty}>
                            {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
                            {t("submit")}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateResourceDialog;
