import { Loader2, Mail, MapPin, Phone } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Textarea } from "@/components/ui/textarea";
import { ContactSchema, ContactSchemaInitData, ContactSchemaType } from "@/services/contact/contact.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

type ContactFormProps = {
    onSubmit: (values: object) => void;
    loading: boolean;
};

function ContactForm({ onSubmit, loading }: ContactFormProps) {
    const { t } = useTranslation();
    const form = useForm<ContactSchemaType>({ resolver: zodResolver(ContactSchema), defaultValues: ContactSchemaInitData });

    function handleSubmit(values: ContactSchemaType) {
        onSubmit(values);
    }

    return (
        <div className="flex flex-col-reverse border-x border-t md:flex-row md:items-start md:justify-center md:gap-4">
            <Card className="bg-transparent shadow-none ring-0">
                <CardContent className="flex flex-col justify-center gap-8">
                    <div className="flex flex-col gap-8">
                        <a href="mailto:anassar@nexerium.com" className="text-foreground hover:text-primary focus-visible:ring-ring flex min-w-0 items-start gap-3 rounded-md transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none">
                            <Mail className="text-muted-foreground size-5 shrink-0" aria-hidden />
                            <div className="min-w-0 flex-1">
                                <span className="text-muted-foreground block text-xs">{t("email")}</span>
                                <span className="text-sm">anassar@nexerium.com</span>
                            </div>
                        </a>
                        <div className="flex items-start gap-3">
                            <Phone className="text-muted-foreground size-5 shrink-0" aria-hidden />
                            <div className="min-w-0 flex-1">
                                <span className="text-muted-foreground block text-xs">{t("phone")}</span>
                                <span className="text-foreground text-sm" dir="ltr">
                                    +966 55 309 3129
                                </span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="text-muted-foreground size-5 shrink-0" aria-hidden />
                            <div className="min-w-0 flex-1">
                                <span className="text-muted-foreground block text-xs">{t("location")}</span>
                                <span className="text-foreground text-sm">{t("contact-location-value")}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <a href="https://github.com/AKMN7" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-[opacity,transform] hover:scale-105 hover:opacity-80">
                            <img src="/images/github.png" alt="" aria-hidden className="size-10" />
                        </a>
                        <a href="https://wa.me/966553093129" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="transition-[opacity,transform] hover:scale-105 hover:opacity-80">
                            <img src="/images/whatsapp.png" alt="" aria-hidden className="size-10" />
                        </a>
                        <a href="https://www.linkedin.com/in/anas-nassar-%D8%A3%D9%86%D8%B3-%D9%86%D8%B5%D8%A7%D8%B1-a164ab211" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-[opacity,transform] hover:scale-105 hover:opacity-80">
                            <img src="/images/linkedin.png" alt="" aria-hidden className="size-10" />
                        </a>
                        <a href="https://x.com/akmn74" target="_blank" rel="noopener noreferrer" aria-label="X" className="transition-[opacity,transform] hover:scale-105 hover:opacity-80">
                            <img src="/images/twitterx.png" alt="" aria-hidden className="size-10" />
                        </a>
                        <a href="https://www.instagram.com/akmn74_" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-[opacity,transform] hover:scale-105 hover:opacity-80">
                            <img src="/images/instagram.png" alt="" aria-hidden className="size-10" />
                        </a>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full bg-transparent shadow-none ring-0 md:max-w-md">
                <CardContent>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <FieldGroup className="gap-6">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="contact-name">{t("name")}</FieldLabel>
                                        <Input id="contact-name" aria-invalid={fieldState.invalid} placeholder={t("contact-name-placeholder")} disabled={loading} {...field} />
                                        <FieldDescription>{t("contact-name-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[{ ...fieldState.error, message: t(fieldState.error?.message ?? "") }]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="contact-email">{t("email")}</FieldLabel>
                                        <InputGroup>
                                            <InputGroupAddon>
                                                <Mail />
                                            </InputGroupAddon>
                                            <InputGroupInput id="contact-email" aria-invalid={fieldState.invalid} placeholder={t("placeholder-email-example")} disabled={loading} {...field} />
                                        </InputGroup>
                                        <FieldDescription>{t("contact-email-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[{ ...fieldState.error, message: t(fieldState.error?.message ?? "") }]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="contact-phone">{t("phone")}</FieldLabel>
                                        <Input id="contact-phone" aria-invalid={fieldState.invalid} type="tel" placeholder={t("placeholder-phone")} disabled={loading} {...field} />
                                        <FieldDescription>{t("contact-phone-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[{ ...fieldState.error, message: t(fieldState.error?.message ?? "") }]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="message"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="contact-message">{t("contact-message-label")}</FieldLabel>
                                        <Textarea id="contact-message" aria-invalid={fieldState.invalid} placeholder={t("contact-message-placeholder")} disabled={loading} {...field} />
                                        <FieldDescription>{t("contact-message-description")}</FieldDescription>
                                        {fieldState.invalid && <FieldError errors={[{ ...fieldState.error, message: t(fieldState.error?.message ?? "") }]} />}
                                    </Field>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={loading || !form.formState.isValid}>
                                {loading ? <Loader2 className="size-4 animate-spin" /> : t("contact-send")}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ContactForm;
