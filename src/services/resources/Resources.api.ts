import { ResourceStatusType } from "@/lib/enums";
import API from "@/services/API";
import { ResourceSchemaType } from "@/services/resources/Resources.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/resources` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/resources`;

export type Resource = {
    _id: string;
    createdAt: string;
    description?: string;
    name: string;
    ownerEmail: string;
    scopeId: string;
    status: ResourceStatusType;
    updatedAt: string;
};

export async function getAllResources(scopeId: string) {
    const response = await API.GET<Resource[]>(`${ENDPOINT}/${scopeId}`);
    return response;
}

export async function getResourceById(scopeId: string, resourceId: string) {
    const response = await API.GET<Resource>(`${ENDPOINT}/${scopeId}/${resourceId}`);
    return response;
}

export async function createResource(scopeId: string, payload: ResourceSchemaType, idempotencyKey: string) {
    const response = await API.POST<string>(`${ENDPOINT}/${scopeId}`, payload, { headers: { "Idempotency-Key": idempotencyKey } });
    return response;
}

export async function updateResource(scopeId: string, resourceId: string, payload: ResourceSchemaType) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${scopeId}/${resourceId}`, payload);
    return response;
}

export async function deleteResources(scopeId: string, resourceIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${scopeId}`, { targets: resourceIds });
    return response;
}
