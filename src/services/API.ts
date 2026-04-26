import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.withCredentials = true;

// Type for the getToken function
type GetTokenFunctionType = ReturnType<typeof useAuth>["getToken"];

// Initialize the getToken function
let clerkGetToken: GetTokenFunctionType | null = null;

// Set the getToken function
export function setClerkGetToken(getToken: GetTokenFunctionType) {
    clerkGetToken = getToken;
}

axios.interceptors.request.use(async (config) => {
    if (clerkGetToken) {
        try {
            const token = await clerkGetToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
            console.error("Error Setting Clerk Token:", error);
        }
    }
    if (config.url?.includes("amazonaws")) config.headers.Authorization = undefined;
    if (config.url?.includes("lambda")) config.withCredentials = false;
    return config;
});

function errorHandler(error: unknown) {
    if (error instanceof AxiosError) return new Error(error?.response?.data?.message || "service-unavailable");
    if (error instanceof Error) return new Error(error.message);
    return new Error("service-unavailable");
}

export default {
    async GET<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = (await axios.get(url, config)).data;
            return response;
        } catch (err) {
            throw errorHandler(err);
        }
    },
    async POST<T = unknown>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = (await axios.post(url, data, config)).data;
            return response;
        } catch (err) {
            throw errorHandler(err);
        }
    },
    async PATCH<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = (await axios.patch(url, data, config)).data;
            return response;
        } catch (err) {
            throw errorHandler(err);
        }
    },
    async PUT<T = unknown>(url: string, data: object, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = (await axios.put(url, data, config)).data;
            return response;
        } catch (err) {
            throw errorHandler(err);
        }
    },
    async DELETE<T = unknown>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = (await axios.delete(url, { data, ...config })).data;
            return response;
        } catch (err) {
            throw errorHandler(err);
        }
    }
};
