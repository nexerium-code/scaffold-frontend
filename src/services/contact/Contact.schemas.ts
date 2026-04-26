import * as z from "zod";

export const ContactSchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }),
    email: z.email({ error: "email-is-required" }),
    phone: z.string({ error: "phone-is-required" }).trim().regex(/^05\d{8}$/, { error: "this-field-must-be-a-valid-saudi-phone-number" }),
    message: z.string({ error: "message-is-required" }).trim().min(1, { error: "message-can-not-be-empty" })
});

export type ContactSchemaType = z.infer<typeof ContactSchema>;

export const ContactSchemaInitData: ContactSchemaType = {
    name: "",
    email: "",
    phone: "",
    message: ""
};
