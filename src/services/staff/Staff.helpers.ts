import Papa from "papaparse";

import { Staff } from "@/services/staff/Staff.api";

export function StructureStaffToExport(staffMembers: Staff[]) {
    const headers = ["name", "email", "phone", "gender", "identification", "type", "picture"];

    const data = staffMembers.map((member) => {
        return {
            name: member?.name ?? "",
            email: member?.email ?? "",
            phone: member?.phone ?? "",
            gender: member?.gender ?? "",
            identification: member?.identification ?? "",
            type: member?.type ?? "",
            picture: member?.picture ?? ""
        };
    });

    return { headers, data };
}

export function StaffCSVExporter(headers: string[], data: Record<string, unknown>[]) {
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
    link.download = `staff_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function StaffJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `staff_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
