import Papa from "papaparse";

import { FilterableTypes, SearchableTypes } from "@/lib/enums";
import { Exclusive } from "@/services/exclusives/Exclusives.api";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

export function StructureExclusiveTableData(exclusives: Exclusive[]) {
    return exclusives.map((exclusive) => {
        return {
            _id: exclusive._id,
            attendanceId: exclusive.attendanceId,
            attended: exclusive.attended,
            qrCodeToken: exclusive.qrCodeToken,
            picture: exclusive.picture,
            ...exclusive.data
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

export function StructureExclusiveToExport(formFields: Record<string, FormInputSchemaType>, exclusives: Record<string, unknown>[]) {
    // Create headers from formFields keys plus picture/qrCodeToken/attended
    const headers = [...Object.keys(formFields), "picture", "qrCodeToken", "attended"];

    // Structure data rows with only the fields defined in headers
    const data = exclusives.map((exclusive) => {
        const row: Record<string, unknown> = {};

        // Add data from formFields with safeguards
        for (const field of Object.keys(formFields)) {
            row[field] = exclusive?.[field] ?? "";
        }

        // Add picture with safeguard
        row.picture = exclusive?.picture ?? "";

        // Add qrCodeToken with safeguard
        row.qrCodeToken = exclusive?.qrCodeToken ?? "";

        // Add attended with safeguard
        row.attended = exclusive?.attended ? true : false;

        return row;
    });

    return {
        headers,
        data
    };
}

export function ExclusiveCSVExporter(headers: string[], data: Record<string, unknown>[]) {
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
    link.download = `exclusives_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function ExclusiveJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `exclusives_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
