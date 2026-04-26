import * as z from "zod";

export const ScopeSchema = z.object({
    name: z.string({ error: "name-is-required" }).trim().min(1, { error: "name-can-not-be-empty" }).max(80, { error: "name-is-too-long" })
});

export type ScopeSchemaType = z.infer<typeof ScopeSchema>;

export const ScopeSchemaInitData: ScopeSchemaType = {
    name: ""
};
