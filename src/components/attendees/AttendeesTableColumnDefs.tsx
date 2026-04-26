import FormatActionsHeaderAndCell from "@/components/attendees/AttendeesTableActionCell";
import {
    FormatAttendedHeaderAndCell, FormatCheckboxHeaderAndCell, FormatDateHeaderAndCell, FormatEmailHeaderAndCell, FormatLinkTextHeaderAndCell, FormatLongTextHeaderAndCell, FormatNumberHeaderAndCell, FormatPaymentCategoryHeaderAndCell, FormatPaymentIdHeaderAndCell, FormatPaymentStatusHeaderAndCell, FormatPhoneHeaderAndCell, FormatRadioHeaderAndCell,
    FormatSelectedDatesHeaderAndCell, FormatSelectedHeaderAndCell, FormatSelectHeaderAndCell, FormatShortTextHeaderAndCell
} from "@/components/attendees/AttendeesTableHeaderAndCellFuncs";
import { AttendanceType, AttendanceTypes, FormInputTypes } from "@/lib/enums";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";
import { ColumnDef } from "@tanstack/react-table";

export function AttendeesTableColumnDefs(eventId: string, attendanceType: AttendanceType, formFields: Record<string, FormInputSchemaType>, language: string) {
    const columns: ColumnDef<Record<string, unknown>>[] = [];

    columns.push(FormatSelectedHeaderAndCell());

    for (const [key, field] of Object.entries(formFields)) {
        if (FormInputTypes.EMAIL === field.type) columns.push(FormatEmailHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.SHORT_TEXT === field.type) columns.push(FormatShortTextHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.LONG_TEXT === field.type) columns.push(FormatLongTextHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.LINK === field.type) columns.push(FormatLinkTextHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.NUMBER === field.type) columns.push(FormatNumberHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.PHONE === field.type) columns.push(FormatPhoneHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.CHECKBOX === field.type) columns.push(FormatCheckboxHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.RADIO === field.type) columns.push(FormatRadioHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.SELECT === field.type) columns.push(FormatSelectHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else if (FormInputTypes.DATE === field.type) columns.push(FormatDateHeaderAndCell(key, language === "en-US" ? field.titleEN : field.titleAR));
        else columns.push({ accessorKey: key, header: language === "en-US" ? field.titleEN : field.titleAR });
    }

    if (attendanceType === AttendanceTypes.PAID) {
        columns.push(FormatPaymentIdHeaderAndCell(), FormatPaymentStatusHeaderAndCell(), FormatPaymentCategoryHeaderAndCell());
    }

    columns.push(FormatSelectedDatesHeaderAndCell(), FormatAttendedHeaderAndCell(), FormatActionsHeaderAndCell(eventId, attendanceType));

    return columns;
}
