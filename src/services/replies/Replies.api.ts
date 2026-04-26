import API from "@/services/API";

export type Reply = {
    _id: string;
    feedbackId: string;
    data: Record<string, unknown>;
    createdAt: Date;
};

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/replies` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/replies`;

export async function getAllReplies(eventId: string, feedbackId: string) {
    const response = await API.GET<Reply[]>(`${ENDPOINT}/${eventId}/${feedbackId}`);
    return response;
}
