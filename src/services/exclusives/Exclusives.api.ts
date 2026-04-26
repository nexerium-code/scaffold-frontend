import API from "@/services/API";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/exclusives` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/exclusives`;

export type Exclusive = {
    _id: string;
    attendanceId: string;
    attended: boolean;
    qrCodeToken: string;
    picture: string;
    data: Record<string, string | number | string[] | Date>;
    createdAt: Date;
    updatedAt: Date;
};

export async function getAllExclusives(eventId: string) {
    const response = await API.GET<Exclusive[]>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function getExclusiveById(eventId: string, exclusiveId: string) {
    const response = await API.GET<Exclusive>(`${ENDPOINT}/${eventId}/${exclusiveId}`);
    return response;
}

export async function createExclusive(eventId: string, payload: { picture: File | string; data: object }, idempotencyKey: string) {
    if (payload.picture && payload.picture instanceof File) payload.picture = await getPictureUploadUrl(eventId, payload.picture);
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload, {
        headers: { "Idempotency-Key": idempotencyKey }
    });
    return response;
}

export async function updateExclusive(eventId: string, exclusiveId: string, payload: { picture: File | string; data: object }) {
    if (payload.picture && payload.picture instanceof File) payload.picture = await getPictureUploadUrl(eventId, payload.picture);
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${exclusiveId}`, payload);
    return response;
}

export async function updateExclusivesAttended(eventId: string, exclusiveIds: string[]) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, { targets: exclusiveIds });
    return response;
}

export async function deleteExclusives(eventId: string, exclusiveIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}`, { targets: exclusiveIds });
    return response;
}

async function getPictureUploadUrl(eventId: string, picture: File) {
    const getPictureUploadUrlResponse = await API.POST<{ uploadUrl: string; imgUrl: string }>(`${ENDPOINT}/${eventId}/get-picture-upload-url`, { mime: picture.type });
    await API.PUT<string>(getPictureUploadUrlResponse.uploadUrl, picture);
    return getPictureUploadUrlResponse.imgUrl;
}
