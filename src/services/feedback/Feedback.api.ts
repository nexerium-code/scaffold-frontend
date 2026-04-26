import API from "@/services/API";
import { FeedbackSchemaType } from "@/services/feedback/Feedback.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/feedback` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/feedback`;

export type Feedback = {
    _id: string;
    eventId: string;
    title: string;
    publish: boolean;
    target: {
        attendees: boolean;
        enrollees: boolean;
        participants: boolean;
    };
    senderEmail: string;
    templateId: string;
    totalReplies: number;
};

export async function getFeedbackStats(eventId: string) {
    const response = await API.GET<{ feedbackCount: number; replyCount: number }>(`${ENDPOINT}/${eventId}/stats`);
    return response;
}

export async function getAllFeedbacks(eventId: string) {
    const response = await API.GET<Feedback[]>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function getFeedbackById(eventId: string, feedbackId: string) {
    const response = await API.GET<Feedback>(`${ENDPOINT}/${eventId}/${feedbackId}`);
    return response;
}

export async function createFeedback(eventId: string, payload: FeedbackSchemaType, idempotencyKey: string) {
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload, {
        headers: { "Idempotency-Key": idempotencyKey }
    });
    return response;
}

export async function updateFeedback(eventId: string, feedbackId: string, payload: FeedbackSchemaType) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${feedbackId}`, payload);
    return response;
}

export async function deleteFeedback(eventId: string, feedbackId: string) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}/${feedbackId}`);
    return response;
}

export async function broadcastFeedback(eventId: string, feedbackId: string) {
    const response = await API.PATCH<{ totalRecipients: number; emailsSent: number }>(`${ENDPOINT}/${eventId}/${feedbackId}/broadcast`);
    return response;
}
