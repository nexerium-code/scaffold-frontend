import * as z from "zod";

import { ParticipantTypes } from "@/lib/enums";

export const ParticipantSchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }),
    email: z.email({ error: "email-is-required" }),
    type: z.enum(Object.values(ParticipantTypes) as [string, ...string[]], { error: "type-not-specified" }),
    phone: z.string({ error: "phone-is-required" }).trim().regex(/^05\d{8}$/, { error: "this-field-must-be-a-valid-saudi-phone-number" }),
    reference: z.string({ error: "reference-is-required" }).trim().min(1, { error: "reference-can-not-be-empty" }).max(100, { error: "reference-is-too-long" }),
    logo: z.custom(
        (value) => {
            if (value === undefined) return true;
            if (value instanceof File || typeof value === "string") return true;
            return false;
        },
        { error: "invalid-image" }
    )
});

export type ParticipantSchemaType = z.infer<typeof ParticipantSchema>;

export const ParticipantSchemaInitData: ParticipantSchemaType = {
    name: "",
    email: "",
    type: "",
    phone: "",
    reference: "",
    logo: undefined
};
