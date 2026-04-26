import { ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Column, ColumnDef, Row, Table as TableType } from "@tanstack/react-table";

import ResourcesTableActionCell from "@/components/resources/ResourcesTableActionCell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Resource } from "@/services/resources/Resources.api";

function SelectHeader({ table }: { table: TableType<Resource> }) {
    const { t } = useTranslation();

    return <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label={t("select-all")} />;
}

function SelectCell({ row }: { row: Row<Resource> }) {
    const { t } = useTranslation();

    return <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label={t("select-row")} />;
}

function SortableHeader({ column, label }: { column: Column<Resource, unknown>; label: string }) {
    const { t } = useTranslation();

    return (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            {t(label)}
            <ArrowUpDown />
        </Button>
    );
}

function TranslatedHeader({ label }: { label: string }) {
    const { t } = useTranslation();

    return t(label);
}

function StatusCell({ resource }: { resource: Resource }) {
    const { t } = useTranslation();

    return <Badge variant="secondary">{t(resource.status)}</Badge>;
}

export function ResourcesTableColumnDefs(): ColumnDef<Resource>[] {
    return [
        {
            id: "select",
            header: ({ table }) => <SelectHeader table={table} />,
            cell: ({ row }) => <SelectCell row={row} />,
            enableSorting: false,
            enableHiding: false
        },
        {
            accessorKey: "name",
            header: ({ column }) => <SortableHeader column={column} label="name" />,
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader column={column} label="status" />,
            cell: ({ row }) => <StatusCell resource={row.original} />,
            filterFn: (row, id, value) => (value as string[]).includes(row.getValue(id))
        },
        {
            accessorKey: "ownerEmail",
            header: () => <TranslatedHeader label="owner-email" />
        },
        {
            accessorKey: "updatedAt",
            header: () => <TranslatedHeader label="updated-at" />,
            cell: ({ row }) => <span>{new Date(row.original.updatedAt).toLocaleDateString()}</span>
        },
        {
            id: "actions",
            cell: ({ row }) => <ResourcesTableActionCell resource={row.original} />,
            enableHiding: false
        }
    ];
}
