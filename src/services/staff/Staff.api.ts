import { GenderType, StaffType } from "@/lib/enums";
import API from "@/services/API";
import { StaffSchemaType } from "@/services/staff/Staff.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/staff` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/staff`;

export type Staff = {
    _id: string;
    eventId: string;
    name: string;
    email: string;
    type: StaffType;
    identification: string;
    phone: string;
    gender: GenderType;
    picture: string;
};

export async function getAllStaff(eventId: string, participantId: string) {
    const response = await API.GET<Staff[]>(`${ENDPOINT}/${eventId}/${participantId}`);
    return response;
}

export async function getStaffById(eventId: string, participantId: string, staffId: string) {
    const response = await API.GET<Staff>(`${ENDPOINT}/${eventId}/${participantId}/${staffId}`);
    return response;
}

export async function createStaff(eventId: string, participantId: string, payload: StaffSchemaType) {
    if (payload.picture && payload.picture instanceof File) payload.picture = await getStaffPictureUploadUrl(eventId, participantId, payload.picture);
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}/${participantId}`, payload);
    return response;
}

export async function updateStaff(eventId: string, participantId: string, staffId: string, payload: StaffSchemaType) {
    if (payload.picture && payload.picture instanceof File) payload.picture = await getStaffPictureUploadUrl(eventId, participantId, payload.picture);
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${participantId}/${staffId}`, payload);
    return response;
}

export async function deleteStaff(eventId: string, participantId: string, staffIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}/${participantId}`, { targets: staffIds });
    return response;
}

async function getStaffPictureUploadUrl(eventId: string, participantId: string, picture: File) {
    const getStaffPictureUploadUrlResponse = await API.POST<{ uploadUrl: string; imgUrl: string }>(ENDPOINT + "/" + eventId + "/" + participantId + "/get-staff-picture-upload-url", { mime: picture.type });
    await API.PUT<string>(getStaffPictureUploadUrlResponse.uploadUrl, picture);
    return getStaffPictureUploadUrlResponse.imgUrl;
}
