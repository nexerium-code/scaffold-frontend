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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateStaff } from "@/hooks/staff/useCreateStaff";
import { GenderTypes, StaffTypes } from "@/lib/enums";
import { capitalizeFirstLetter, cn } from "@/lib/utils";
import { StaffSchema, StaffSchemaInitData, StaffSchemaType } from "@/services/staff/Staff.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type CreateStaffDialogProps = {
    eventId: string;
    participantId: string;
};

function CreateStaffDialog({ eventId, participantId }: CreateStaffDialogProps) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const form = useForm<StaffSchemaType>({ resolver: zodResolver(StaffSchema), defaultValues: StaffSchemaInitData });
    const { createStaff, loading } = useCreateStaff(() => setOpen(false));

    function onSubmit(values: StaffSchemaType) {
        createStaff({ eventId, participantId, payload: values });
    }

    function resetState() {
        form.reset(StaffSchemaInitData);
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
                        <DialogTitle>{t("create-staff")}</DialogTitle>
                        <DialogDescription>{t("create-staff-description")}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-6">
                            <Controller
                                name="picture"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" className="items-end!" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel>{t("picture")}</FieldLabel>
                                            <FieldDescription>{t("picture-description-staff")}</FieldDescription>
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
                                        <FieldLabel htmlFor="staff-type">{t("type")}</FieldLabel>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger disabled={loading} asChild>
                                                <Button id="staff-type" aria-invalid={fieldState.invalid} variant="outline" role="combobox" className={cn("w-full justify-between font-normal", !field.value && "text-muted-foreground")}>
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
                                                            {Object.values(StaffTypes).map((type) => (
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
                                        <FieldDescription>{t("type-description-staff")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="staff-name">{t("name")}</FieldLabel>
                                        <Input id="staff-name" aria-invalid={fieldState.invalid} placeholder={t("placeholder-participant-name")} disabled={loading} {...field} />
                                        <FieldDescription>{t("staff-name-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="staff-email">{t("email")}</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Mail />
                                            </InputGroupAddon>
                                            <InputGroupInput id="staff-email" aria-invalid={fieldState.invalid} placeholder={t("placeholder-email-example")} disabled={loading} {...field} />
                                        </InputGroup>
                                        <FieldDescription>{t("staff-email-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="staff-phone">{t("phone")}</FieldLabel>
                                        <Input id="staff-phone" aria-invalid={fieldState.invalid} type="tel" placeholder={t("placeholder-phone")} disabled={loading} {...field} />
                                        <FieldDescription>{t("staff-phone-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="gender"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="staff-gender">{t("gender")}</FieldLabel>
                                        <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading} {...field}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("select-gender")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={GenderTypes.MALE}>{t("male")}</SelectItem>
                                                <SelectItem value={GenderTypes.FEMALE}>{t("female")}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FieldDescription>{t("gender-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="identification"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="staff-identification">{t("identification")}</FieldLabel>
                                        <Input id="staff-identification" aria-invalid={fieldState.invalid} placeholder={t("placeholder-identification")} disabled={loading} {...field} />
                                        <FieldDescription>{t("staff-identification-description")}</FieldDescription>
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
            <TooltipContent>{t("create-staff")}</TooltipContent>
        </Tooltip>
    );
}

export default CreateStaffDialog;
