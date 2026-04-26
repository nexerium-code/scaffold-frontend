import API from "@/services/API";
import { WorkshopSchemaType } from "@/services/workshop/Workshop.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/workshop` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/workshop`;

export type Workshop = {
    _id: string;
    eventId: string;
    titleEN: string;
    titleAR: string;
    publish: boolean;
    senderEmail: string;
    managerEmail: string;
    welcomeTemplateId: string;
    approvedTemplateId: string;
    totalEnrollees: number;
    totalApprovedEnrollees: number;
};

export async function getWorkshopStats(eventId: string) {
    const response = await API.GET<{ workshopCount: number; enrolleeCount: number; approvedEnrolleeCount: number }>(`${ENDPOINT}/${eventId}/stats`);
    return response;
}

export async function getAllWorkshops(eventId: string) {
    const response = await API.GET<Workshop[]>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function getWorkshopById(eventId: string, workshopId: string) {
    const response = await API.GET<Workshop>(`${ENDPOINT}/${eventId}/${workshopId}`);
    return response;
}

export async function createWorkshop(eventId: string, payload: WorkshopSchemaType, idempotencyKey: string) {
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload, {
        headers: { "Idempotency-Key": idempotencyKey }
    });
    return response;
}

export async function updateWorkshop(eventId: string, workshopId: string, payload: WorkshopSchemaType) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${workshopId}`, payload);
    return response;
}

export async function deleteWorkshop(eventId: string, workshopId: string) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}/${workshopId}`);
    return response;
}
