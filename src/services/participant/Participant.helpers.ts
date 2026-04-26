import Papa from "papaparse";

import { Participant } from "@/services/participant/Participant.api";

export function StructureParticipantToExport(participants: Participant[]) {
    const headers = ["name", "email", "phone", "type", "reference", "approved", "logo"];

    const data = participants.map((participant) => {
        return {
            name: participant?.name ?? "",
            email: participant?.email ?? "",
            phone: participant?.phone ?? "",
            type: participant?.type ?? "",
            reference: participant?.reference ?? "",
            approved: participant?.approved ? true : false,
            logo: participant?.logo ?? ""
        };
    });

    return {
        headers,
        data
    };
}

export function ParticipantCSVExporter(headers: string[], data: Record<string, unknown>[]) {
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
    link.download = `participants_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function ParticipantJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `participants_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
