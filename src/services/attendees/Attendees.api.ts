import { EntryType, PaymentStatusType } from "@/lib/enums";
import API from "@/services/API";
import { CategorySchemaType } from "@/services/attendance/Attendance.main.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/attendees` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/attendees`;

export type Attendee = {
    _id: string;
    attendanceId: string;
    attended: boolean;
    selectedDates: string[];
    entries: { value: string; type: EntryType }[];
    paymentId: string | undefined;
    paymentStatus: PaymentStatusType | undefined;
    category: CategorySchemaType | undefined;
    qrCodeToken: string;
    data: Record<string, string | number | string[] | Date>;
    createdAt: Date;
    updatedAt: Date;
};

export async function getAllAttendees(eventId: string) {
    const response = await API.GET<Attendee[]>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function getAttendeeById(eventId: string, attendeeId: string) {
    const response = await API.GET<Attendee>(`${ENDPOINT}/${eventId}/${attendeeId}`);
    return response;
}

export async function updateAttendee(eventId: string, attendeeId: string, payload: { data: object }) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${attendeeId}`, payload);
    return response;
}

export async function resendAttendeeEmail(eventId: string, attendeeId: string) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${attendeeId}/resend-email`);
    return response;
}

export async function updateAttendeesAttended(eventId: string, attendeeIds: string[]) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, { targets: attendeeIds });
    return response;
}

export async function deleteAttendees(eventId: string, attendeeIds: string[]) {
    const response = await API.DELETE<string>(`${ENDPOINT}/${eventId}`, { targets: attendeeIds });
    return response;
}

export async function updateAttendeePaymentStatus(eventId: string, attendeeId: string) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/${attendeeId}/payment-status`);
    return response;
}
