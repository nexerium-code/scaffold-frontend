import * as z from "zod";

import { FormInputTypes, MustHaveOptions } from "@/lib/enums";

export const FormInputSchema = z
    .object({
        titleEN: z.string({ error: "title-is-required" }).trim().min(1, { error: "title-can-not-be-empty" }),
        titleAR: z.string({ error: "title-is-required" }).trim().min(1, { error: "title-can-not-be-empty" }),
        type: z.enum(FormInputTypes, { error: "type-not-specified" }),
        unique: z.boolean(),
        required: z.boolean(),
        options: z.array(z.string().trim()).optional()
    })
    .superRefine((data, ctx) => {
        if (!MustHaveOptions.has(data.type)) return;

        if (!data.options || data.options.length < 2) {
            ctx.addIssue({
                code: "custom",
                error: "at-least-two-options-are-required",
                path: ["options"]
            });
            return;
        }

        // Check for empty options
        for (let i = 0; i < data.options.length; i++) {
            if (data.options[i].trim() === "") {
                ctx.addIssue({
                    code: "custom",
                    error: "option-value-can-not-be-empty",
                    path: ["options", i]
                });
            }
        }

        // Check for duplicates
        const seenNames = new Map<string, number>();
        for (let i = 0; i < data.options.length; i++) {
            const trimmedValue = data.options[i].trim();
            if (seenNames.has(trimmedValue)) {
                ctx.addIssue({
                    code: "custom",
                    error: "duplicate-option-value",
                    path: ["options", i]
                });
            } else {
                seenNames.set(trimmedValue, i);
            }
        }
    });

export type FormInputSchemaType = z.infer<typeof FormInputSchema>;
