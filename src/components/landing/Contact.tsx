import { useState } from "react";
import { useTranslation } from "react-i18next";

import Squares from "@/components/general/Squares";
import ContactForm from "@/components/landing/ContactForm";
import ContactSuccess from "@/components/landing/ContactSuccess";
import { useSendContact } from "@/hooks/contact/useSendContact";

function Contact() {
    const { t } = useTranslation();
    const [state, setState] = useState<"form" | "success">("form");
    const { sendContact, loading } = useSendContact(handleSuccess);

    function handleSubmit(data: object) {
        sendContact(data);
    }

    function handleSuccess() {
        setState("success");
    }

    function handleReset() {
        setState("form");
    }

    return (
        <section id="contact" aria-label="Contact" className="layout-container overflow-hidden">
            <div className="relative h-70 border-x">
                <Squares direction="diagonal" speed={0.2} squareSize={30} />
                <div className="pointer-events-none absolute inset-0 z-10 p-12">
                    <p className="text-muted-foreground text-sm font-semibold tracking-tight text-balance uppercase">{t("contact-subtitle")}</p>
                    <h2 className="mt-2 text-4xl leading-tight font-extrabold text-balance md:text-5xl lg:text-6xl">{t("contact-title")}</h2>
                    <p className="text-muted-foreground max-w-md text-xl">{t("contact-description")}</p>
                </div>
            </div>
            {state === "form" && <ContactForm onSubmit={handleSubmit} loading={loading} />}
            {state === "success" && <ContactSuccess onReset={handleReset} />}
        </section>
    );
}

export default Contact;
