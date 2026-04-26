import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateResource } from "@/hooks/resources/useCreateResource";
import { ResourceStatusTypes } from "@/lib/enums";
import { ResourceSchema, ResourceSchemaInitData, ResourceSchemaType } from "@/services/resources/Resources.schemas";

type CreateResourceDialogProps = {
    scopeId: string;
};

function CreateResourceDialog({ scopeId }: CreateResourceDialogProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const form = useForm<ResourceSchemaType>({ resolver: zodResolver(ResourceSchema), defaultValues: ResourceSchemaInitData, mode: "onChange" });
    const { createResource, loading } = useCreateResource(() => setOpen(false));

    function onSubmit(values: ResourceSchemaType) {
        createResource({ scopeId, payload: values });
    }

    function resetState() {
        form.reset(ResourceSchemaInitData);
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
                        <DialogTitle>{t("create-resource")}</DialogTitle>
                        <DialogDescription>{t("create-resource-description")}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="resource-name">{t("name")}</FieldLabel>
                                        <Input id="resource-name" aria-invalid={fieldState.invalid} placeholder={t("name-placeholder")} disabled={loading} {...field} />
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
                                        <FieldLabel htmlFor="resource-owner-email">{t("owner-email")}</FieldLabel>
                                        <Input id="resource-owner-email" aria-invalid={fieldState.invalid} type="email" placeholder={t("owner-email-placeholder")} disabled={loading} {...field} />
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
                                        <FieldLabel htmlFor="resource-status">{t("status")}</FieldLabel>
                                        <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                                            <SelectTrigger id="resource-status" aria-invalid={fieldState.invalid} className="w-full">
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
                                        <FieldLabel htmlFor="resource-description">{t("description")}</FieldLabel>
                                        <Textarea id="resource-description" aria-invalid={fieldState.invalid} placeholder={t("description-placeholder")} disabled={loading} {...field} />
                                        <FieldDescription>{t("resource-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid}>
                                {loading && <Loader2 data-icon="inline-start" className="animate-spin" />}
                                {t("submit")}
                            </Button>
                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>
            <TooltipContent>{t("create-resource")}</TooltipContent>
        </Tooltip>
    );
}

export default CreateResourceDialog;
