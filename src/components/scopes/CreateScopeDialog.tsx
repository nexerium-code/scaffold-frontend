import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateScope } from "@/hooks/scopes/useCreateScope";
import { ScopeSchema, ScopeSchemaInitData, ScopeSchemaType } from "@/services/scopes/Scopes.schemas";

type CreateScopeDialogProps = {
    onOpenChange?: (open: boolean) => void;
    open?: boolean;
    showTrigger?: boolean;
};

function CreateScopeDialog({ onOpenChange, open, showTrigger = true }: CreateScopeDialogProps) {
    const { t } = useTranslation();
    const [internalOpen, setInternalOpen] = useState(false);
    const dialogOpen = open ?? internalOpen;
    const setDialogOpen = onOpenChange ?? setInternalOpen;
    const form = useForm<ScopeSchemaType>({ resolver: zodResolver(ScopeSchema), defaultValues: ScopeSchemaInitData, mode: "onChange" });
    const { createScope, loading } = useCreateScope(() => setDialogOpen(false));

    function onSubmit(values: ScopeSchemaType) {
        createScope(values);
    }

    function resetState() {
        form.reset(ScopeSchemaInitData);
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            {showTrigger && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon">
                                <PlusCircle />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>{t("create-scope")}</TooltipContent>
                </Tooltip>
            )}
            <DialogContent onCloseAutoFocus={resetState}>
                <DialogHeader>
                    <DialogTitle>{t("create-scope")}</DialogTitle>
                    <DialogDescription>{t("create-scope-description")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="scope-name">{t("name")}</FieldLabel>
                                    <Input id="scope-name" aria-invalid={fieldState.invalid} placeholder={t("scope-name-placeholder")} disabled={loading} {...field} />
                                    <FieldDescription>{t("scope-name-description")}</FieldDescription>
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
    );
}

export default CreateScopeDialog;
