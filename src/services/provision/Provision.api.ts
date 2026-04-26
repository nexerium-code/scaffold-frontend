import API from "@/services/API";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/provision` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/provision`;

export type Provision = {
    _id: string;
    eventId: string;
    publish: boolean;
    senderEmail: string;
    managerEmail: string;
    welcomeTemplateId: string;
    approvedTemplateId: string;
    badgeTemplateId: string;
    references: string[];
    availableReferences: string[];
};

export async function getPublicProvision(eventId: string) {
    const response = await API.GET<Provision>(`${ENDPOINT}/public/${eventId}`);
    return response;
}

export async function getUserProvision(eventId: string) {
    const response = await API.GET<Provision>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function createProvision(eventId: string, payload: object) {
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload);
    return response;
}

export async function updateProvision(eventId: string, payload: object) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, payload);
    return response;
}
