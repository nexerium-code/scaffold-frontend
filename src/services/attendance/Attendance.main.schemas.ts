import * as z from "zod";

import { AttendanceTypes, EntryPolicyTypes } from "@/lib/enums";

export const CategorySchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }),
    price: z
        .string({ error: "price-is-required" })
        .trim()
        .min(1, { error: "price-can-not-be-empty" })
        .regex(/^\d+$/, { error: "price-must-contain-numbers-only" })
        .refine(
            (val) => {
                const num = Number(val);
                return num >= 1 && num <= 10000;
            },
            { error: "price-must-be-between-1-and-10k" }
        )
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;

export const AttendanceDateSchema = z.object({
    value: z.date({ error: "date-is-required" }),
    active: z.boolean({ error: "active-status-not-specified" })
});

export type AttendanceDateSchemaType = z.infer<typeof AttendanceDateSchema>;

const BaseSchema = z.object({
    publish: z.boolean({ error: "publish-status-not-specified" }),
    entryPolicy: z.enum(Object.values(EntryPolicyTypes) as [string, ...string[]], { error: "entry-policy-not-specified" }),
    dates: z
        .array(AttendanceDateSchema)
        .nonempty({ error: "dates-are-required" })
        .superRefine((dates, ctx) => {
            const seenValues = new Map<string, number>();
            for (let i = 0; i < dates.length; i++) {
                const dateValue = dates[i].value.toISOString();
                if (seenValues.has(dateValue)) {
                    ctx.addIssue({
                        code: "custom",
                        error: "duplicate-date-value",
                        path: [i]
                    });
                } else {
                    seenValues.set(dateValue, i);
                }
            }
        }),
    senderEmail: z.email({ error: "email-is-required" }),
    welcomeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" }),
    attendeesBadgeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^[a-z0-9]{13}$/, { error: "this-field-must-be-a-valid-placid-template-id" }),
    exclusivesBadgeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^[a-z0-9]{13}$/, { error: "this-field-must-be-a-valid-placid-template-id" }),
    code: z.string({ error: "code-is-required" }).trim().min(1, { error: "code-can-not-be-empty" }).regex(/^\d+$/, { error: "code-must-contain-numbers-only" }).min(6, { error: "code-is-too-short" }).max(6, { error: "code-is-too-long" })
});

export const AttendanceMainSchema = z.discriminatedUnion("type", [
    BaseSchema.extend({
        type: z.literal(AttendanceTypes.FREE)
    }),
    BaseSchema.extend({
        type: z.literal(AttendanceTypes.PAID),
        categories: z
            .array(CategorySchema)
            .nonempty({ error: "categories-are-required-for-paid-type" })
            .superRefine((categories, ctx) => {
                const seenNames = new Map<string, number>();
                for (let i = 0; i < categories.length; i++) {
                    const trimmedName = categories[i].name.trim().toLowerCase();
                    if (seenNames.has(trimmedName)) {
                        ctx.addIssue({
                            code: "custom",
                            error: "duplicate-category-name",
                            path: [i]
                        });
                    } else {
                        seenNames.set(trimmedName, i);
                    }
                }
            })
    })
]);

export type AttendanceMainSchemaType = z.infer<typeof AttendanceMainSchema>;

export const AttendanceMainSchemaInitData: AttendanceMainSchemaType = {
    publish: false,
    type: AttendanceTypes.FREE,
    entryPolicy: "",
    dates: [{ value: new Date(), active: true }],
    senderEmail: "",
    welcomeTemplateId: "",
    attendeesBadgeTemplateId: "",
    exclusivesBadgeTemplateId: "",
    code: ""
};
