import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Papa from "papaparse";

import { FilterableTypes, SearchableTypes } from "@/lib/enums";
import { Attendee } from "@/services/attendees/Attendees.api";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export function StructureAttendeeTableData(attendees: Attendee[]) {
    return attendees.map((attendee) => {
        return {
            _id: attendee._id,
            attendanceId: attendee.attendanceId,
            attended: attendee.attended,
            selectedDates: attendee.selectedDates,
            qrCodeToken: attendee.qrCodeToken,
            ...attendee.data
        };
    });
}

export function StructureAttendeePaidTableData(attendees: Attendee[]) {
    return attendees.map((attendee) => {
        return {
            _id: attendee._id,
            attendanceId: attendee.attendanceId,
            attended: attendee.attended,
            selectedDates: attendee.selectedDates,
            paymentId: attendee.paymentId || "N/A",
            paymentStatus: attendee.paymentStatus || "N/A",
            category: attendee.category || { name: "N/A", price: 0 },
            qrCodeToken: attendee.qrCodeToken,
            ...attendee.data
        };
    });
}

export function StructureSerchableFields(formFields: Record<string, FormInputSchemaType>) {
    const searchFields: Record<string, FormInputSchemaType> = {};

    for (const [key, field] of Object.entries(formFields)) {
        if (SearchableTypes.has(field.type)) {
            searchFields[key] = field;
        }
    }

    return searchFields;
}

export function StructureFilterableFields(formFields: Record<string, FormInputSchemaType>) {
    const filterFields: Record<string, FormInputSchemaType> = {};

    for (const [key, field] of Object.entries(formFields)) {
        if (FilterableTypes.has(field.type)) {
            filterFields[key] = field;
        }
    }

    return filterFields;
}

export function StructureAttendeeToExport(formFields: Record<string, FormInputSchemaType>, attendees: Record<string, unknown>[]) {
    // Create headers from formFields keys plus selectedDates
    const headers = [...Object.keys(formFields), "selectedDates", "qrCodeToken", "attended"];

    // Structure data rows with only the fields defined in headers
    const data = attendees.map((attendee) => {
        const row: Record<string, unknown> = {};

        // Add data from formFields with safeguards
        for (const field of Object.keys(formFields)) {
            row[field] = attendee?.[field] ?? "";
        }

        // Always add selectedDates with safeguard - convert array to comma-separated string
        const selectedDates = attendee?.selectedDates ?? [];
        if (Array.isArray(selectedDates)) {
            // Extract date part from UTC strings (e.g., "2024-01-15T10:30:00.000Z" -> "2024-01-15")
            const dateStrings = selectedDates.map((date: unknown) => (typeof date === "string" ? date.substring(0, 10) : date));
            row.selectedDates = dateStrings;
        } else {
            row.selectedDates = selectedDates;
        }

        // Add attended with safeguard
        row.attended = attendee?.attended ? true : false;

        // Add qrCodeToken with safeguard
        row.qrCodeToken = attendee?.qrCodeToken ?? "";

        return row;
    });

    return {
        headers,
        data
    };
}

export function AttendeeCSVExporter(headers: string[], data: Record<string, unknown>[]) {
    // Papa expects fields + data objects
    const csv = Papa.unparse({
        fields: headers,
        data
    });

    // Add UTF-8 BOM (important for Arabic)
    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendees_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function AttendeeJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendees_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}

export function StructureAttendeesRegisteredChart(attendees: Attendee[]) {
    // Create a Map to efficiently group attendees by date
    const dateCountMap = new Map<string, number>();

    // Group attendees by their creation date (YYYY-MM-DD format)
    for (const attendee of attendees) {
        const date = toZonedTime(new Date(attendee.createdAt), "Asia/Riyadh");
        const dateKey = format(date, "yyyy-MM-dd");
        // Increment count for this date
        dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
    }

    // Convert Map to array and sort by date
    return Array.from(dateCountMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}
