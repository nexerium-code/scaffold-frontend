import { useTranslation } from "react-i18next";

import { ColumnDef } from "@tanstack/react-table";

export const RepliesTableColumnDefs: ColumnDef<{ data: string }>[] = [
    {
        accessorKey: "data",
        header: () => <TranslatedHeader header="data" />
    }
];

function TranslatedHeader({ header }: { header: string }) {
    const { t } = useTranslation();
    return t(header);
}
