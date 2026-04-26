import * as z from "zod";

export const FeedbackSchema = z
    .object({
        publish: z.boolean({ error: "publish-status-not-specified" }),
        title: z.string({ error: "title-is-required" }).trim().min(1, { error: "title-can-not-be-empty" }),
        target: z.object({
            attendees: z.boolean({ error: "attendees-target-not-specified" }),
            enrollees: z.boolean({ error: "enrollees-target-not-specified" }),
            participants: z.boolean({ error: "participants-target-not-specified" })
        }),
        senderEmail: z.email({ error: "email-is-required" }),
        templateId: z.string({ error: "invalid-field-entry" }).trim().regex(/^d-[a-f0-9]{32}$/, { error: "this-field-must-be-a-valid-sendgrid-template-id" })
    })
    .refine((data) => data.target.participants || data.target.attendees || data.target.enrollees, {
        path: ["target"],
        error: "at-least-one-target-must-be-selected"
    });

export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;

export const FeedbackSchemaInitData: FeedbackSchemaType = {
    publish: false,
    title: "",
    target: {
        attendees: false,
        enrollees: false,
        participants: false
    },
    senderEmail: "",
    templateId: ""
};
