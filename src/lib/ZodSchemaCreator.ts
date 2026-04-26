import { z } from "zod";

import { FormInputTypes } from "@/lib/enums";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export default function ZodSchemaCreator(formFields: Record<string, FormInputSchemaType>) {
    // Init schema fields
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    // Loop through the schema fields array
    for (const [key, value] of Object.entries(formFields)) {
        // Init base schema
        let baseSchema: z.ZodTypeAny | undefined;

        // Short Text Validation
        if (value.type === FormInputTypes.SHORT_TEXT) {
            baseSchema = z.string({ error: "this-field-is-required" }).trim().min(1, "this-field-can-not-be-empty").max(50, "this-field-is-too-long");
        }
        // Long Text Validation
        else if (value.type === FormInputTypes.LONG_TEXT) {
            baseSchema = z.string({ error: "this-field-is-required" }).trim().min(1, "this-field-can-not-be-empty").max(200, "this-field-is-too-long");
        }
        // Email Validation
        else if (value.type === FormInputTypes.EMAIL) {
            baseSchema = z.email({ error: "this-field-is-required" }).toLowerCase();
        }
        // Number Validation
        else if (value.type === FormInputTypes.NUMBER) {
            baseSchema = z.number({ error: "this-field-is-required" }).min(0, "this-field-must-be-a-valid-number");
        }
        // Phone Number Validation
        else if (value.type === FormInputTypes.PHONE) {
            baseSchema = z
                .string({ error: "this-field-is-required" })
                .trim()
                .regex(/^05\d{8}$/, "this-field-must-be-a-valid-saudi-phone-number");
        }
        // Link Validation
        else if (value.type === FormInputTypes.LINK) {
            baseSchema = z
                .string({ error: "this-field-is-required" })
                .trim()
                .regex(/^(https:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?(\.[a-zA-Z]{2,})?$/, "this-field-must-be-a-valid-url");
        }
        // Radio Validation
        else if (value.type === FormInputTypes.RADIO) {
            baseSchema = z.enum(value.options as [string, ...string[]], { error: "invalid-field-entry" });
        }
        // Select Validation
        else if (value.type === FormInputTypes.SELECT) {
            baseSchema = z.enum(value.options as [string, ...string[]], { error: "invalid-field-entry" });
        }
        // Checkbox Validation
        else if (value.type === FormInputTypes.CHECKBOX) {
            baseSchema = z.array(z.enum(value.options as [string, ...string[]], { error: "invalid-checkbox-selection" }), { error: "invalid-field-entry" });
        }
        // Date Validation
        else if (value.type === FormInputTypes.DATE) {
            baseSchema = z.iso.date({ error: "invalid-field-entry" });
        }
        // Time Validation
        else if (value.type === FormInputTypes.TIME) {
            baseSchema = z.iso.time({ error: "invalid-field-entry" });
        }
        // Date Range Validation
        else if (value.type === FormInputTypes.DATE_RANGE) {
            baseSchema = z
                .array(z.iso.date({ error: "invalid-field-entry" }))
                .length(2, "date-range-must-have-two-dates")
                .refine(([start, end]) => start < end, { error: "date-range-end-date-must-be-after-start-date" });
        }
        // Default case
        else {
            baseSchema = z.string({ error: "invalid-field-entry" }).trim().min(1, "this-field-can-not-be-empty").max(50, "this-field-is-too-long");
        }

        // Apply required or optional state
        schemaFields[key] = value.required ? baseSchema : baseSchema.optional();
    }

    // Return zodSchema
    return z.object(schemaFields);
}
