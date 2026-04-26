import { toZonedTime } from "date-fns-tz";

import { AttendanceTypes } from "@/lib/enums";
import { toYMD } from "@/lib/utils";
import { Attendance } from "@/services/attendance/Attendance.api";
import { AttendanceFormFieldsAttendeesSchemaType, AttendanceFormFieldsExclusivesSchemaType } from "@/services/attendance/Attendance.formFields.schemas";
import { AttendanceMainSchemaType } from "@/services/attendance/Attendance.main.schemas";
import { CreateAttendanceInitData } from "@/services/attendance/Attendance.schemas";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export function prepareCreateAttendanceData(data: typeof CreateAttendanceInitData) {
    const attendanceMainData = prepareAttendanceMainData(data.MAIN);
    const attendanceFormFieldsAttendeesData = prepareAttendanceFormFieldsAttendeesData(data.FORM_FIELDS_ATTENDEES);
    const attendanceFormFieldsExclusivesData = prepareAttendanceFormFieldsExclusivesData(data.FORM_FIELDS_EXCLUSIVES);

    return {
        ...attendanceMainData,
        ...attendanceFormFieldsAttendeesData,
        ...attendanceFormFieldsExclusivesData
    };
}

export function prepareAttendanceMainData(data: AttendanceMainSchemaType) {
    const { dates, ...rest } = data;
    return {
        ...rest,
        dates: dates.map((date) => ({
            ...date,
            value: toYMD(date.value)
        }))
    };
}

export function prepareAttendanceFormFieldsAttendeesData(data: AttendanceFormFieldsAttendeesSchemaType) {
    const { formFieldsAttendees } = data;
    // Convert the formField array into an object keyed by field title
    const formFieldsObject: Record<string, FormInputSchemaType> = {};
    for (const field of formFieldsAttendees) {
        formFieldsObject[field.titleEN] = field;
    }

    return {
        formFieldsAttendees: formFieldsObject
    };
}

export function prepareAttendanceFormFieldsExclusivesData(data: AttendanceFormFieldsExclusivesSchemaType) {
    const { formFieldsExclusives } = data;
    // Convert the formField array into an object keyed by field title
    const formFieldsObject: Record<string, FormInputSchemaType> = {};
    for (const field of formFieldsExclusives) {
        formFieldsObject[field.titleEN] = field;
    }

    return {
        formFieldsExclusives: formFieldsObject
    };
}

export function initAttendanceMainData(data: Attendance) {
    const baseData = {
        publish: data.publish,
        entryPolicy: data.entryPolicy,
        dates: data.dates.map((date) => ({
            ...date,
            value: toZonedTime(date.value, "Asia/Riyadh")
        })),
        senderEmail: data.senderEmail,
        welcomeTemplateId: data.welcomeTemplateId,
        attendeesBadgeTemplateId: data.attendeesBadgeTemplateId,
        exclusivesBadgeTemplateId: data.exclusivesBadgeTemplateId,
        code: data.code
    };

    if (data.type === AttendanceTypes.PAID) {
        return {
            ...baseData,
            type: AttendanceTypes.PAID,
            categories: (data.categories || []).map((category) => ({
                ...category,
                price: String(category.price)
            }))
        };
    }

    return {
        ...baseData,
        type: AttendanceTypes.FREE
    };
}

export function initAttendanceFormFieldsAttendeesData(data: Attendance) {
    return {
        formFieldsAttendees: Object.values(data.formFieldsAttendees)
    };
}

export function initAttendanceFormFieldsExclusivesData(data: Attendance) {
    return {
        formFieldsExclusives: Object.values(data.formFieldsExclusives)
    };
}
