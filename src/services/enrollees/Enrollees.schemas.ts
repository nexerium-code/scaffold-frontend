import { z } from "zod";

export const EnrolleeSchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }),
    email: z.email({ error: "email-is-required" }),
    phone: z.string({ error: "phone-is-required" }).trim().regex(/^05\d{8}$/, { error: "this-field-must-be-a-valid-saudi-phone-number" })
});

export type EnrolleeSchemaType = z.infer<typeof EnrolleeSchema>;

export const EnrolleeSchemaInitData: EnrolleeSchemaType = {
    name: "",
    email: "",
    phone: ""
};
