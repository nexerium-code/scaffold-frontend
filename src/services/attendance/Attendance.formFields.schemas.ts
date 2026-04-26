import * as z from "zod";

import { FormInputTypes } from "@/lib/enums";
import { FormInputSchema } from "@/services/form-fields/FormFields.schemas";

export const AttendanceFormFieldsAttendeesSchema = z.object({
    formFieldsAttendees: z.array(FormInputSchema).superRefine((fields, ctx) => {
        // Check for at least one form field
        if (fields.length === 0) {
            ctx.addIssue({
                code: "custom",
                error: "form-must-have-at-least-one-field"
            });
        }

        // Check for one and only one email field
        if (fields.filter((field) => field.titleEN === "Email" && field.type === FormInputTypes.EMAIL).length !== 1) {
            ctx.addIssue({
                code: "custom",
                error: "form-must-have-one-and-only-one-literal-email-field"
            });
        }

        // Check for duplicate form fields
        const seenTitles = new Map<string, number>();
        for (let i = 0; i < fields.length; i++) {
            const trimmedTitle = fields[i].titleEN.trim();
            if (seenTitles.has(trimmedTitle)) {
                ctx.addIssue({
                    code: "custom",
                    error: "duplicate-title",
                    path: [i, "titleEN"]
                });
            } else {
                seenTitles.set(trimmedTitle, i);
            }
        }
    })
});

export type AttendanceFormFieldsAttendeesSchemaType = z.infer<typeof AttendanceFormFieldsAttendeesSchema>;

export const AttendanceFormFieldsAttendeesSchemaInitData: AttendanceFormFieldsAttendeesSchemaType = {
    formFieldsAttendees: [{ titleEN: "Email", titleAR: "البريد الإلكتروني", type: FormInputTypes.EMAIL, unique: true, required: true }]
};

export const AttendanceFormFieldsExclusivesSchema = z.object({
    formFieldsExclusives: z.array(FormInputSchema).superRefine((fields, ctx) => {
        // Check for at least one form field
        if (fields.length === 0) {
            ctx.addIssue({
                code: "custom",
                error: "form-must-have-at-least-one-field"
            });
        }

        // Check for at least one required field
        if (!fields.some((field) => field.required)) {
            ctx.addIssue({
                code: "custom",
                error: "form-must-have-at-least-one-required-field"
            });
        }

        // Check for duplicate form fields
        const seenTitles = new Map<string, number>();
        for (let i = 0; i < fields.length; i++) {
            const trimmedTitle = fields[i].titleEN.trim();
            if (seenTitles.has(trimmedTitle)) {
                ctx.addIssue({
                    code: "custom",
                    error: "duplicate-title",
                    path: [i, "titleEN"]
                });
            } else {
                seenTitles.set(trimmedTitle, i);
            }
        }
    })
});

export type AttendanceFormFieldsExclusivesSchemaType = z.infer<typeof AttendanceFormFieldsExclusivesSchema>;

export const AttendanceFormFieldsExclusivesSchemaInitData: AttendanceFormFieldsExclusivesSchemaType = {
    formFieldsExclusives: [{ titleEN: "Name", titleAR: "الاسم", type: FormInputTypes.SHORT_TEXT, unique: false, required: true }]
};
