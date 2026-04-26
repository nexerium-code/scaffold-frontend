import { useTranslation } from "react-i18next";

import { ColumnDef } from "@tanstack/react-table";

export function WorkshopTableColumnDefs(_eventId: string) {
    const columns: ColumnDef<Record<string, unknown>>[] = [
        {
            accessorKey: "titleEN",
            header: () => <TranslatedHeader header="title-english" />
        },
        {
            accessorKey: "titleAR",
            header: () => <TranslatedHeader header="title-arabic" />
        },
        {
            accessorKey: "senderEmail",
            header: () => <TranslatedHeader header="sender-email" />
        },
        {
            accessorKey: "managerEmail",
            header: () => <TranslatedHeader header="manager-email" />
        },
        {
            accessorKey: "welcomeTemplateId",
            header: () => <TranslatedHeader header="welcome-template-id" />
        },
        {
            accessorKey: "approvedTemplateId",
            header: () => <TranslatedHeader header="approved-template-id" />
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
