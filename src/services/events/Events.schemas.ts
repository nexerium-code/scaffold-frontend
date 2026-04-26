import * as z from "zod";

import { EventTypes, LocationTypes } from "@/lib/enums";

export const EventSchema = z.object({
    name: z.string({ error: "please-provide-a-name" }).trim().min(1, { error: "please-provide-a-name" }),
    type: z.enum(Object.values(EventTypes) as [string, ...string[]], { error: "type-not-specified" }),
    dates: z
        .object(
            {
                from: z.date().optional(),
                to: z.date().optional()
            },
            { error: "dates-are-required" }
        )
        .refine((data) => data.from && data.to && data.to > data.from, {
            error: "invalid-event-dates"
        }),
    location: z.object({
        type: z.enum(Object.values(LocationTypes) as [string, ...string[]], { error: "location-type-not-specified" }),
        url: z.string({ error: "please-provide-an-url" }).trim().refine((value) => /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(value), {
            error: "invalid-location-url"
        })
    }),
    publish: z.boolean({ error: "publish-status-not-specified" })
});

export type EventSchemaType = z.infer<typeof EventSchema>;

export const EventSchemaInitData: EventSchemaType = {
    name: "",
    type: "",
    dates: {
        from: undefined,
        to: undefined
    },
    location: {
        type: "",
        url: ""
    },
    publish: false
};
