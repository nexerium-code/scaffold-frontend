import Papa from "papaparse";

import { Enrollee } from "@/services/enrollees/Enrollees.api";

export function StructureEnrolleeToExport(enrollees: Enrollee[]) {
    const headers = ["name", "email", "phone", "approved"];

    const data = enrollees.map((enrollee) => {
        return {
            name: enrollee?.name ?? "",
            email: enrollee?.email ?? "",
            phone: enrollee?.phone ?? "",
            approved: enrollee?.approved ? true : false
        };
    });

    return { headers, data };
}

export function EnrolleeCSVExporter(headers: string[], data: Record<string, unknown>[]) {
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
    link.download = `enrollees_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function EnrolleeJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enrollees_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
