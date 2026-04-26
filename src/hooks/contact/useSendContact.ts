import { useState } from "react";

import { createContact } from "@/services/contact/Contact.api";

export function useSendContact(onSuccess: () => void) {
    const [loading, setLoading] = useState(false);

    async function sendContact(data: object) {
        setLoading(true);
        try {
            await createContact(data);
            onSuccess();
        } catch (error) {
            console.error("Contact send failed:", error);
        } finally {
            setLoading(false);
        }
    }

    return { sendContact, loading };
}
