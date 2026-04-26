import { useTranslation } from "react-i18next";

import WorkshopCard from "@/components/workshop/WorkshopCard";
import { Workshop } from "@/services/workshop/Workshop.api";
import { Table as TableType } from "@tanstack/react-table";

type WorkshopTableMainProps<TData> = {
    eventId: string;
    table: TableType<TData>;
};

function WorkshopTableMain<TData>({ eventId, table }: WorkshopTableMainProps<TData>) {
    const { t } = useTranslation();
    const rows = table.getFilteredRowModel().rows;

    if (rows.length === 0) {
        return <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">{t("no-workshops-found")}</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
                const workshop = row.original as unknown as Workshop;
                return <WorkshopCard key={row.id} eventId={eventId} workshop={workshop} index={row.index} />;
            })}
        </div>
    );
}

export default WorkshopTableMain;
