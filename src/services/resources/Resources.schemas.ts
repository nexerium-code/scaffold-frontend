import * as z from "zod";

import { ResourceStatusTypes } from "@/lib/enums";

export const ResourceSchema = z.object({
    description: z.string().trim().max(240, { error: "description-is-too-long" }).optional(),
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }).max(100, { error: "name-is-too-long" }),
    ownerEmail: z.email({ error: "owner-email-is-required" }),
    status: z.enum(Object.values(ResourceStatusTypes) as [string, ...string[]], { error: "status-is-required" })
});

export type ResourceSchemaType = z.infer<typeof ResourceSchema>;

export const ResourceSchemaInitData: ResourceSchemaType = {
    description: "",
    name: "",
    ownerEmail: "",
    status: ResourceStatusTypes.DRAFT
};
