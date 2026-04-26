import API from "@/services/API";
import { EnrolleeSchemaType } from "@/services/enrollees/Enrollees.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/enrollees` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/enrollees`;

export type Enrollee = {
    _id: string;
    workshopId: string;
    name: string;
    email: string;
    phone: string;
    approved: boolean;
};

export async function getAllEnrollees(eventId: string, workshopId: string) {
    const response = await API.GET<Enrollee[]>(`${ENDPOINT}/${eventId}/${workshopId}`);
    return response;
}

export async function getEnrolleeById(eventId: string, workshopId: string, enrolleeId: string) {
    const response = await API.GET<Enrollee>(`${ENDPOINT}/${eventId}/${workshopId}/${enrolleeId}`);
    return response;
}

export async function createEnrollee(eventId: string, workshopId: string, payload: EnrolleeSchemaType) {
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}/${workshopId}`, payload);
    return response;
}

export async function updateEnrollee(eventId: string, workshopId: string, enrolleeId: string, payload: EnrolleeSchemaType) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${workshopId}/${enrolleeId}`, payload);
    return response;
}

export async function approveEnrollees(eventId: string, workshopId: string, enrolleeIds: string[]) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${workshopId}`, { targets: enrolleeIds });
    return response;
}

export async function deleteEnrollees(eventId: string, workshopId: string, enrolleeIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}/${workshopId}`, { targets: enrolleeIds });
    return response;
}
