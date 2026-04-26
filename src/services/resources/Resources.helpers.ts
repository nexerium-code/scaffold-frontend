import Papa from "papaparse";

import { Resource } from "@/services/resources/Resources.api";

type ResourceExportRow = {
    description: string;
    name: string;
    ownerEmail: string;
    status: string;
    updatedAt: string;
};

export function StructureResourceToExport(resources: Resource[]) {
    const headers = ["name", "description", "ownerEmail", "status", "updatedAt"];
    const data: ResourceExportRow[] = resources.map((resource) => ({
        description: resource.description || "",
        name: resource.name,
        ownerEmail: resource.ownerEmail,
        status: resource.status,
        updatedAt: resource.updatedAt
    }));

    return { data, headers };
}

export function ResourcesCSVExporter(headers: string[], data: ResourceExportRow[]) {
    const csv = "\ufeff" + Papa.unparse({ fields: headers, data });
    downloadBlob(csv, `resources_${Date.now()}.csv`, "text/csv;charset=utf-8;");
}

export function ResourcesJSONExporter(data: ResourceExportRow[]) {
    const json = JSON.stringify(data, null, 4);
    downloadBlob(json, `resources_${Date.now()}.json`, "application/json;charset=utf-8;");
}

function downloadBlob(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
