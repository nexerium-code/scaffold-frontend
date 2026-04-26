import { AttendanceType, EntryPolicyType } from "@/lib/enums";
import API from "@/services/API";
import { AttendanceDateSchemaType, CategorySchemaType } from "@/services/attendance/Attendance.main.schemas";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

const ENDPOINT = import.meta.env.VITE_ENV === "PROD" ? `${import.meta.env.VITE_BE_ENDPOINT}/attendance` : `${import.meta.env.VITE_BE_ENDPOINT}:3000/attendance`;

export type Attendance = {
    _id: string;
    eventId: string;
    publish: boolean;
    type: AttendanceType;
    categories: CategorySchemaType[] | undefined;
    entryPolicy: EntryPolicyType;
    dates: AttendanceDateSchemaType[];
    senderEmail: string;
    welcomeTemplateId: string;
    attendeesBadgeTemplateId: string;
    exclusivesBadgeTemplateId: string;
    code: string;
    formFieldsAttendees: Record<string, FormInputSchemaType>;
    formFieldsExclusives: Record<string, FormInputSchemaType>;
};

export async function getPublicAttendnace(eventId: string) {
    const response = await API.GET<Attendance>(`${ENDPOINT}/public/${eventId}`);
    return response;
}

export async function getAttendnaceStats(eventId: string) {
    const response = await API.GET<{
        registeredAttendees: number;
        attendedAttendees: number;
        registeredExclusives: number;
        attendedExclusives: number;
    }>(`${ENDPOINT}/${eventId}/stats`);
    return response;
}

export async function getUserAttendnace(eventId: string) {
    const response = await API.GET<Attendance>(`${ENDPOINT}/${eventId}`);
    return response;
}

export async function createAttendance(eventId: string, payload: object) {
    const response = await API.POST<string>(`${ENDPOINT}/${eventId}`, payload);
    return response;
}

export async function updateAttendanceMain(eventId: string, payload: object) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}`, payload);
    return response;
}

export async function updateAttendanceFormFieldsAttendees(eventId: string, payload: object) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/form-fields-attendees`, payload);
    return response;
}

export async function updateAttendanceFormFieldsExclusives(eventId: string, payload: object) {
    const response = await API.PATCH<string>(`${ENDPOINT}/${eventId}/form-fields-exclusives`, payload);
    return response;
}
