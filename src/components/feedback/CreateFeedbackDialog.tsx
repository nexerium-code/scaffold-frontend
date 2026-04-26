import { Braces, Mail, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Switch } from "@/components/ui/switch";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useCreateFeedback } from "@/hooks/feedback/useCreateFeedback";
import { FeedbackSchema, FeedbackSchemaInitData, FeedbackSchemaType } from "@/services/feedback/feedback.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

function CreateFeedbackDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const [open, setOpen] = useState(false);
    const { createFeedback, loading } = useCreateFeedback(() => setOpen(false));

    const form = useForm<FeedbackSchemaType>({ resolver: zodResolver(FeedbackSchema), defaultValues: FeedbackSchemaInitData });

    function onSubmit(values: FeedbackSchemaType) {
        createFeedback({ eventId: selectedEvent, payload: values });
    }

    function resetState() {
        form.reset(FeedbackSchemaInitData);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {t("create-feedback")} <PlusCircle className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("create-feedback")}</DialogTitle>
                    <DialogDescription>{t("create-feedback-description")}</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-6">
                        <FieldSet>
                            <Controller
                                name="publish"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="feedback-publish">{t("publish-state")}</FieldLabel>
                                            <FieldDescription>{t("publish-state-feedback-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Switch id="feedback-publish" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="title"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="feedback-title">{t("title")}</FieldLabel>
                                        <Input id="feedback-title" aria-invalid={fieldState.invalid} placeholder={t("placeholder-feedback-title")} disabled={loading} {...field} />
                                        <FieldDescription>{t("feedback-title-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="senderEmail"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="feedback-senderEmail">{t("sender-email")}</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Mail />
                                            </InputGroupAddon>
                                            <InputGroupInput id="feedback-senderEmail" aria-invalid={fieldState.invalid} placeholder={t("placeholder-sender-email")} disabled={loading} {...field} />
                                        </InputGroup>
                                        <FieldDescription>{t("sender-email-recipients-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="templateId"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="feedback-templateId">{t("email-template")}</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Braces />
                                            </InputGroupAddon>
                                            <InputGroupInput id="feedback-templateId" aria-invalid={fieldState.invalid} placeholder={t("placeholder-template-id")} disabled={loading} {...field} />
                                        </InputGroup>
                                        <FieldDescription>{t("email-template-feedback-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </FieldSet>
                        <FieldSeparator />
                        <FieldSet>
                            <FieldLegend>{t("target")}</FieldLegend>
                            <FieldDescription>{t("target-feedback-description")}</FieldDescription>
                            <FieldGroup className="gap-2">
                                <Controller
                                    name="target.attendees"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FieldLabel htmlFor="feedback-target-attendees">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>{t("attendees")}</FieldTitle>
                                                    <FieldDescription>{t("target-attendees-description")}</FieldDescription>
                                                </FieldContent>
                                                <Checkbox id="feedback-target-attendees" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                            </Field>
                                        </FieldLabel>
                                    )}
                                />
                                <Controller
                                    name="target.enrollees"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FieldLabel htmlFor="feedback-target-enrollees">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>{t("enrollees")}</FieldTitle>
                                                    <FieldDescription>{t("target-enrollees-description")}</FieldDescription>
                                                </FieldContent>
                                                <Checkbox id="feedback-target-enrollees" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                            </Field>
                                        </FieldLabel>
                                    )}
                                />
                                <Controller
                                    name="target.participants"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FieldLabel htmlFor="feedback-target-participants">
                                            <Field orientation="horizontal">
                                                <FieldContent>
                                                    <FieldTitle>{t("participants")}</FieldTitle>
                                                    <FieldDescription>{t("target-participants-description")}</FieldDescription>
                                                </FieldContent>
                                                <Checkbox id="feedback-target-participants" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                            </Field>
                                        </FieldLabel>
                                    )}
                                />
                            </FieldGroup>
                            {form.formState.errors?.target && <FieldError errors={[form.formState.errors.target]} />}
                        </FieldSet>
                        <Button type="submit" disabled={loading || !form.formState.isValid}>
                            {t("submit")}
                        </Button>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateFeedbackDialog;
