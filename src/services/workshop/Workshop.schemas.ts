import { z } from "zod";

export const WorkshopSchema = z.object({
    publish: z.boolean({ error: "publish-status-not-specified" }),
    titleEN: z.string({ error: "title-is-required" }).trim().min(1, { error: "title-can-not-be-empty" }),
    titleAR: z.string({ error: "title-is-required" }).trim().min(1, { error: "title-can-not-be-empty" }),
    senderEmail: z.email({ error: "email-is-required" }),
    managerEmail: z.email({ error: "email-is-required" }),
    welcomeTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" }),
    approvedTemplateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" })
});

export type WorkshopSchemaType = z.infer<typeof WorkshopSchema>;

export const WorkshopSchemaInitData: WorkshopSchemaType = {
    publish: false,
    titleEN: "",
    titleAR: "",
    senderEmail: "",
    managerEmail: "",
    welcomeTemplateId: "",
    approvedTemplateId: ""
};
