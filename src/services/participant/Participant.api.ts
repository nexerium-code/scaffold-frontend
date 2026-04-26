import { ParticipantType } from "@/lib/enums";
import API from "@/services/API";
import { ParticipantSchemaType } from "@/services/participant/Participant.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/participant` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/participant`;

export type Participant = {
    _id: string;
    eventId: string;
    name: string;
    email: string;
    phone: string;
    approved: boolean;
    type: ParticipantType;
    reference: string;
    logo: string;
};

export async function getParticipantsStats(eventId: string) {
    const response = await API.GET<{ participantCount: number; approvedParticipantCount: number; staffCount: number }>(`${ENDPOINT}/${eventId}/stats`);
    return response;
}

export async function getAllParticipants(eventId: string) {
    const response = await API.GET<Participant[]>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function getParticipantById(eventId: string, participantId: string) {
    const response = await API.GET<Participant>(`${ENDPOINT}/${eventId}/${participantId}`);
    return response;
}

export async function createParticipant(eventId: string, payload: ParticipantSchemaType, idempotencyKey: string) {
    if (payload.logo && payload.logo instanceof File) payload.logo = await getLogoUploadUrl(eventId, payload.logo);
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload, {
        headers: { "Idempotency-Key": idempotencyKey }
    });
    return response;
}

export async function updateParticipant(eventId: string, participantId: string, payload: ParticipantSchemaType) {
    if (payload.logo && payload.logo instanceof File) payload.logo = await getLogoUploadUrl(eventId, payload.logo);
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${participantId}`, payload);
    return response;
}

export async function approveParticipants(eventId: string, participantIds: string[]) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, { targets: participantIds });
    return response;
}

export async function deleteParticipants(eventId: string, participantIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}`, { targets: participantIds });
    return response;
}

async function getLogoUploadUrl(eventId: string, logo: File) {
    const getLogoUploadUrlResponse = await API.POST<{ uploadUrl: string; imgUrl: string }>(`${ENDPOINT}/${eventId}/get-logo-upload-url`, { mime: logo.type });
    await API.PUT<string>(getLogoUploadUrlResponse.uploadUrl, logo);
    return getLogoUploadUrlResponse.imgUrl;
}
