import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import FormatActionsHeaderAndCell from "@/components/enrollees/EnrolleesTableActionCell";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export function EnrolleesTableColumnDefs(eventId: string, workshopId: string) {
    const columns = [...baseColumns];
    columns.push(FormatActionsHeaderAndCell(eventId, workshopId));
    return columns;
}

const baseColumns: ColumnDef<Record<string, unknown>>[] = [
    {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: "name",
        header: () => <TranslatedHeader header="name" />,
        cell: ({ row }) => {
            return <div className="w-max max-w-56 truncate">{row.getValue("name")}</div>;
        }
    },
    {
        accessorKey: "email",
        header: () => <TranslatedHeader header="email" />,
        cell: ({ row }) => {
            return <div className="w-max max-w-56 truncate underline">{row.getValue("email")}</div>;
        }
    },
    {
        accessorKey: "phone",
        header: () => <TranslatedHeader header="phone" />,
        cell: ({ row }) => {
            return <div className="w-max max-w-56 truncate italic">{row.getValue("phone")}</div>;
        }
    },
    {
        accessorKey: "approved",
        header: () => <TranslatedHeader header="approved" />,
        cell: ({ row }) => {
            const value = row.getValue("approved") as boolean;

            if (value) {
                return (
                    <div className="flex aspect-square size-6.5 items-center justify-center rounded-full bg-green-100 text-green-800">
                        <Check className="size-3.5" />
                    </div>
                );
            }

            return (
                <div className="flex aspect-square size-6.5 items-center justify-center rounded-full bg-red-100 text-red-800">
                    <X className="size-3.5" />
                </div>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const rowValue = row.getValue(columnId) as boolean;
            if (!filterValue) return true;
            return rowValue === (filterValue === "true");
        },
        enableSorting: false
    }
];

function TranslatedHeader({ header }: { header: string }) {
    const { t } = useTranslation();
    return t(header);
}
