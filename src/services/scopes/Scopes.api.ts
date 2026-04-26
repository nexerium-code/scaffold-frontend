import API from "@/services/API";
import { ScopeSchemaType } from "@/services/scopes/Scopes.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/scopes` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/scopes`;

export type Scope = {
    _id: string;
    name: string;
};

export async function getUserScopes() {
    const response = await API.GET<Scope[]>(ENDPOINT);
    return response;
}

export async function createScope(payload: ScopeSchemaType, idempotencyKey: string) {
    const response = await API.POST<string>(ENDPOINT, payload, { headers: { "Idempotency-Key": idempotencyKey } });
    return response;
}
