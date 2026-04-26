import { useTranslation } from "react-i18next";

import { ColumnDef } from "@tanstack/react-table";

export function FeedbackTableColumnDefs(_eventId: string) {
    const columns: ColumnDef<Record<string, unknown>>[] = [
        {
            accessorKey: "title",
            header: () => <TranslatedHeader header="title" />
        },
        {
            accessorKey: "target",
            header: () => <TranslatedHeader header="target" />
        },
        {
            accessorKey: "publish",
            header: () => <TranslatedHeader header="published" />,
            filterFn: (row, columnId, filterValue) => {
                const rowValue = row.getValue(columnId) as boolean;
                if (!filterValue) return true;
                return rowValue === (filterValue === "true");
            }
        }
    ];
    return columns;
}

function TranslatedHeader({ header }: { header: string }) {
    const { t } = useTranslation();
    return t(header);
}
