import * as z from "zod";

import { GenderTypes, StaffTypes } from "@/lib/enums";

export const StaffSchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }),
    email: z.email({ error: "email-is-required" }),
    type: z.enum(Object.values(StaffTypes) as [string, ...string[]], { error: "type-not-specified" }),
    identification: z.string({ error: "reference-is-required" }).trim().min(1, { error: "reference-can-not-be-empty" }).max(100, { error: "reference-is-too-long" }),
    phone: z.string({ error: "phone-is-required" }).trim().regex(/^05\d{8}$/, { error: "this-field-must-be-a-valid-saudi-phone-number" }),
    gender: z.enum(Object.values(GenderTypes) as [string, ...string[]], { error: "gender-not-specified" }),
    picture: z.custom(
        (value) => {
            if (value === undefined) return true;
            if (value instanceof File || typeof value === "string") return true;
            return false;
        },
        { error: "invalid-image" }
    )
});

export type StaffSchemaType = z.infer<typeof StaffSchema>;

export const StaffSchemaInitData: StaffSchemaType = {
    name: "",
    email: "",
    type: "",
    identification: "",
    phone: "",
    gender: "",
    picture: undefined
};
