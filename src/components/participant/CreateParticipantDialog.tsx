import { CheckCheck, ChevronsUpDown, Mail, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import ProfilePic from "@/components/general/ProfilePic";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useCreateParticipant } from "@/hooks/participant/useCreateParticipant";
import { ParticipantTypes } from "@/lib/enums";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { ParticipantSchema, ParticipantSchemaInitData, ParticipantSchemaType } from "@/services/participant/Participant.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

function CreateParticipantDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const [open, setOpen] = useState(false);
    const { createParticipant, loading } = useCreateParticipant(() => setOpen(false));

    const form = useForm<ParticipantSchemaType>({ resolver: zodResolver(ParticipantSchema), defaultValues: ParticipantSchemaInitData });

    function onSubmit(values: ParticipantSchemaType) {
        createParticipant({ eventId: selectedEvent, payload: values });
    }

    function resetState() {
        form.reset(ParticipantSchemaInitData);
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
                <DialogContent onCloseAutoFocus={resetState} className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t("create-participant")}</DialogTitle>
                        <DialogDescription>{t("create-participant-description")}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-6">
                            <Controller
                                name="logo"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" className="items-end!" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel>{t("logo")}</FieldLabel>
                                            <FieldDescription>{t("logo-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <ProfilePic image={field.value as string | File | undefined} setImage={(value) => field.onChange(value)} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="participant-type">{t("type")}</FieldLabel>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger disabled={loading} asChild>
                                                <Button id="participant-type" aria-invalid={fieldState.invalid} variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? capitalizeFirstLetter(field.value) : t("select-type")}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start" className="min-w-52">
                                                <Command>
                                                    <CommandInput placeholder={t("search-type-dots")} className="h-9" />
                                                    <CommandList>
                                                        <CommandEmpty>{t("no-type-found")}</CommandEmpty>
                                                        <CommandGroup>
                                                            {Object.values(ParticipantTypes).map((type) => (
                                                                <CommandItem
                                                                    key={type}
                                                                    value={type}
                                                                    onSelect={() => {
                                                                        field.onChange(type);
                                                                    }}
                                                                >
                                                                    {capitalizeFirstLetter(type)}
                                                                    {type === field.value && <CheckCheck className="ms-auto" />}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <FieldDescription>{t("type-description-participant")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="participant-name">{t("name")}</FieldLabel>
                                        <Input id="participant-name" aria-invalid={fieldState.invalid} placeholder={t("placeholder-participant-name")} disabled={loading} {...field} />
                                        <FieldDescription>{t("participant-name-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="participant-email">{t("email")}</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Mail />
                                            </InputGroupAddon>
                                            <InputGroupInput id="participant-email" aria-invalid={fieldState.invalid} placeholder={t("placeholder-email-example")} disabled={loading} {...field} />
                                        </InputGroup>
                                        <FieldDescription>{t("participant-email-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="participant-phone">{t("phone")}</FieldLabel>
                                        <Input id="participant-phone" aria-invalid={fieldState.invalid} type="tel" placeholder={t("placeholder-phone")} disabled={loading} {...field} />
                                        <FieldDescription>{t("participant-phone-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="reference"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="participant-reference">{t("reference")}</FieldLabel>
                                        <Input id="participant-reference" aria-invalid={fieldState.invalid} placeholder={t("placeholder-participant-reference")} disabled={loading} {...field} />
                                        <FieldDescription>{t("participant-reference-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid}>
                                {t("submit")}
                            </Button>
                        </FieldGroup>
                    </form>
                </DialogContent>
            </Dialog>
            <TooltipContent>{t("create-participant")}</TooltipContent>
        </Tooltip>
    );
}

export default CreateParticipantDialog;
