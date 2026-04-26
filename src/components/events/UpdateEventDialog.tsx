import { format } from "date-fns";
import { ArrowLeftRight, CalendarIcon, Laptop, MapPin, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUpdateEvent } from "@/hooks/events/useUpdateEvent";
import { useUserEvent } from "@/hooks/events/useUserEvent";
import { EventTypes, LocationTypes } from "@/lib/enums";
import { calendarSelect } from "@/lib/utils";
import { initEventData, prepareEventData } from "@/services/events/Events.helpers";
import { EventSchema, EventSchemaInitData, EventSchemaType } from "@/services/events/Events.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function UpdateEventDialog() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading: loadingEvent } = useUserEvent(selectedEvent);
    const [open, setOpen] = useState(false);
    const { updateEvent, loading: loadingUpdate } = useUpdateEvent(() => setOpen(false));

    const form = useForm<EventSchemaType>({ resolver: zodResolver(EventSchema), defaultValues: EventSchemaInitData });

    useEffect(() => {
        if (event) form.reset(initEventData(event), { keepDefaultValues: false });
    }, [event, form]);

    function onSubmit(values: EventSchemaType) {
        const finalized = prepareEventData(values);
        updateEvent({ eventId: selectedEvent, payload: finalized });
    }

    const loading = loadingEvent || loadingUpdate;

    function resetState() {
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    {t("edit")} <Pencil />
                </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={resetState} className="inset-0 flex h-screen w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-auto rounded-none border-none p-0 sm:max-w-none rtl:translate-x-0">
                <DialogHeader>
                    <VisuallyHidden>
                        <DialogTitle>{t("update-event-dialog")}</DialogTitle>
                        <DialogDescription>{t("update-event-dialog")}</DialogDescription>
                    </VisuallyHidden>
                    <h3 className="w-max px-4 text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</h3>
                </DialogHeader>
                <form className="flex flex-1 items-center justify-center p-2 pt-0" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="max-w-xl">
                        <FieldSet>
                            <FieldLegend>{t("update-event-main")}</FieldLegend>
                            <FieldDescription>{t("update-event-main-description")}</FieldDescription>
                            <Controller
                                name="publish"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-publish">{t("publish-state")}</FieldLabel>
                                            <FieldDescription>{t("publish-state-event-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Switch id="event-publish" aria-invalid={fieldState.invalid} checked={field.value} onCheckedChange={field.onChange} disabled={loading} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-name">{t("placeholder-name")}</FieldLabel>
                                            <FieldDescription>{t("event-name-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="event-name" aria-invalid={fieldState.invalid} placeholder={t("placeholder-event-name")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-type">{t("type")}</FieldLabel>
                                            <FieldDescription>{t("event-type-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading} {...field}>
                                            <SelectTrigger id="event-type" aria-invalid={fieldState.invalid} className="min-w-46">
                                                <SelectValue placeholder={t("placeholder-select-type")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(EventTypes).map((eventType) => (
                                                    <SelectItem key={eventType} value={eventType}>
                                                        {eventType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                            <Controller
                                name="dates"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-dates">{t("dates")}</FieldLabel>
                                            <FieldDescription>{t("event-dates-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button id="event-dates" aria-invalid={fieldState.invalid} variant="outline" className="min-w-46 font-normal" disabled={loading}>
                                                    {field.value?.from && field.value?.to && `${format(field.value.from, "P")} - ${format(field.value.to, "P")}`}
                                                    {(!field.value?.from || !field.value?.to) && <span className="text-muted-foreground">{t("select-date")}</span>}
                                                    <CalendarIcon className="text-muted-foreground ml-auto" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="range" defaultMonth={field.value?.from} selected={{ from: field.value?.from, to: field.value?.to }} onSelect={(range) => field.onChange(calendarSelect(field.value, range))} />
                                            </PopoverContent>
                                        </Popover>
                                    </Field>
                                )}
                            />
                            <Controller
                                name="location.type"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-location-type">{t("location-type")}</FieldLabel>
                                            <FieldDescription>{t("location-type-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Select defaultValue={field.value} onValueChange={field.onChange} disabled={loading} {...field}>
                                            <SelectTrigger id="event-location-type" aria-invalid={fieldState.invalid} className="min-w-46">
                                                <SelectValue placeholder={t("placeholder-select-type")} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={LocationTypes.ONSITE}>
                                                    <MapPin className="size-4" /> {t("location-onsite")}
                                                </SelectItem>
                                                <SelectItem value={LocationTypes.VIRTUAL}>
                                                    <Laptop className="size-4" /> {t("location-virtual")}
                                                </SelectItem>
                                                <SelectItem value={LocationTypes.HYBRID}>
                                                    <ArrowLeftRight className="size-4" /> {t("location-hybrid")}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>
                                )}
                            />
                            <Controller
                                name="location.url"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                        <FieldContent>
                                            <FieldLabel htmlFor="event-location-url">{t("location-url")}</FieldLabel>
                                            <FieldDescription className="text-balance">{t("location-url-description")}</FieldDescription>
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </FieldContent>
                                        <Input id="event-location-url" aria-invalid={fieldState.invalid} type="url" placeholder={t("placeholder-url-example")} disabled={loading} {...field} />
                                    </Field>
                                )}
                            />
                            <Button type="submit" disabled={loading || !form.formState.isValid || !form.formState.isDirty}>
                                {t("submit")}
                            </Button>
                        </FieldSet>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UpdateEventDialog;
