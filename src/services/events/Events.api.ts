import { EventType } from "@/lib/enums";
import API from "@/services/API";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/event` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/event`;

export type Event = {
    _id: string;
    name: string;
    type: EventType;
    startDate: Date;
    endDate: Date;
    location: {
        type: string;
        url: string;
    };
    publish: boolean;
};

export async function getAllPublicEvents() {
    const response = await API.GET<Array<Event>>(`${ENDPOINT}/public`);
    return response;
}

export async function getPublicEvent(eventId: string) {
    const response = await API.GET<Event>(`${ENDPOINT}/public/${eventId}`);
    return response;
}

export async function getUserEvents() {
    const response = await API.GET<Array<Event>>(`${ENDPOINT}/my-events`);
    return response;
}

export async function getUserEvent(eventId: string) {
    const response = await API.GET<Event>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function createEvent(payload: object, idempotencyKey: string) {
    const response = await API.POST<string>(`${ENDPOINT}/`, payload, {
        headers: { "Idempotency-Key": idempotencyKey }
    });
    return response;
}

export async function updateEvent(eventId: string, payload: object) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, payload);
    return response;
}
