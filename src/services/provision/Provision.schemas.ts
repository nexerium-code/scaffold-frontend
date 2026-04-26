import { z } from "zod";

export const ProvisionSchema = z.object({
    publish: z.boolean({ error: "publish-status-not-specified" }),
    senderEmail: z.email({ error: "email-is-required" }),
    managerEmail: z.email({ error: "email-is-required" }),
    welcomeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" }),
    approvedTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" }),
    badgeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^[a-z0-9]{13}$/, { error: "this-field-must-be-a-valid-placid-template-id" }),
    references: z
        .array(z.string().trim().min(1, { error: "reference-can-not-be-empty" }))
        .nonempty({ error: "references-are-required" })
        .superRefine((refrences, ctx) => {
            const seenNames = new Map<string, number>();
            for (let i = 0; i < refrences.length; i++) {
                const trimmedName = refrences[i].trim().toLowerCase();
                if (seenNames.has(trimmedName)) {
                    ctx.addIssue({
                        code: "custom",
                        error: "duplicate-reference-name",
                        path: [i]
                    });
                } else {
                    seenNames.set(trimmedName, i);
                }
            }
        })
});

export type ProvisionSchemaType = z.infer<typeof ProvisionSchema>;

export const ProvisionSchemaInitData: ProvisionSchemaType = {
    publish: false,
    senderEmail: "",
    managerEmail: "",
    welcomeTemplateId: "",
    approvedTemplateId: "",
    badgeTemplateId: "",
    references: ["R1"]
};
