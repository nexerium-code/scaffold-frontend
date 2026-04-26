import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import Papa from "papaparse";

import { Reply } from "@/services/replies/Replies.api";

export function StructureRepliesTableData(replies: Reply[]) {
    return replies.map((reply) => {
        return {
            data: reply.data ? JSON.stringify(reply.data, null, 2) : "{}"
        };
    });
}

export function StructureRepliesToExport(replies: { data: string }[]) {
    // Parse JSON string back to object and map values into separate cells
    return replies.map((reply) => {
        try {
            return JSON.parse(reply.data);
        } catch {
            return {};
        }
    });
}

// NOTE: Replies export is intentionally headerless (no columns row).
export function RepliesCSVExporter(rows: Record<string, unknown>[]) {
    const csv = Papa.unparse(rows, { header: false });

    // Add UTF-8 BOM (important for Arabic)
    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `replies_${Date.now()}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

export function StructureRepliesReceivedChart(replies: Reply[]) {
    const dateCountMap = new Map<string, number>();

    for (const reply of replies) {
        const date = toZonedTime(new Date(reply.createdAt), "Asia/Riyadh");
        const dateKey = format(date, "yyyy-MM-dd");
        dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
    }

    return Array.from(dateCountMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export function RepliesJSONExporter(data: Record<string, unknown>[]) {
    const json = JSON.stringify(data, null, 2);

    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `replies_${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
}
