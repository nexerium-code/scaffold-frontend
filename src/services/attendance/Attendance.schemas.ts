import { AttendanceFormFieldsAttendeesSchemaInitData, AttendanceFormFieldsAttendeesSchemaType, AttendanceFormFieldsExclusivesSchemaInitData, AttendanceFormFieldsExclusivesSchemaType } from "@/services/attendance/Attendance.formFields.schemas";
import { AttendanceMainSchemaInitData, AttendanceMainSchemaType } from "@/services/attendance/Attendance.main.schemas";

export const CreateAttendanceInitData = {
    MAIN: AttendanceMainSchemaInitData,
    FORM_FIELDS_ATTENDEES: AttendanceFormFieldsAttendeesSchemaInitData,
    FORM_FIELDS_EXCLUSIVES: AttendanceFormFieldsExclusivesSchemaInitData
};

export type AttendanceDataUnion = AttendanceMainSchemaType | AttendanceFormFieldsAttendeesSchemaType | AttendanceFormFieldsExclusivesSchemaType;
