import { toZonedTime } from "date-fns-tz";

import { hasEnded, isBetween, toYMD } from "@/lib/utils";
import { Event } from "@/services/events/Events.api";
import { EventSchemaType } from "@/services/events/Events.schemas";

export function prepareEventData(data: EventSchemaType) {
    const { dates, ...rest } = data;

    return {
        ...rest,
        startDate: toYMD(dates.from),
        endDate: toYMD(dates.to)
    };
}

export function initEventData(event: Event) {
    return {
        name: event?.name || "",
        type: event?.type || "",
        dates: {
            from: toZonedTime(event.startDate, "Asia/Riyadh"),
            to: toZonedTime(event.endDate, "Asia/Riyadh")
        },
        location: {
            type: event?.location?.type || "",
            url: event?.location?.url || ""
        },
        publish: event?.publish ?? false
    };
}

// Determine event status (returns i18n key for translation in components)
export function getEventStatus(event: Event): { key: string; color: string } | undefined {
    if (!event) return;

    if (hasEnded([event.endDate], "All")) {
        return { key: "expired", color: "text-red-600" };
    }

    if (isBetween(event.startDate, event.endDate)) {
        return { key: "active", color: "text-green-600" };
    }

    return { key: "upcoming", color: "text-blue-600" };
}
