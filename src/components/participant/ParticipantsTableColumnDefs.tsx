import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import FormatActionsHeaderAndCell from "@/components/participant/ParticipantsTableActionCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export function ParticipantsTableColumnDefs(eventId: string) {
    const columns = [...baseColumns];
    columns.push(FormatActionsHeaderAndCell(eventId));
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
            const name = row.getValue("name") as string;
            const logo = row.original.logo as string;

            return (
                <div className="flex w-max max-w-56 items-center gap-4 truncate">
                    <Avatar className="size-8 rounded-lg">
                        <AvatarImage src={logo} alt="profile-pic" />
                        <AvatarFallback className="bg-muted rounded-lg">{name?.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    {name}
                </div>
            );
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
        accessorKey: "type",
        header: () => <TranslatedHeader header="type" />,
        cell: ({ row }) => {
            return <Badge variant="outline">{capitalizeFirstLetter(row.getValue("type"))}</Badge>;
        }
    },
    {
        accessorKey: "reference",
        header: () => <TranslatedHeader header="reference" />,
        cell: ({ row }) => {
            return <Badge variant="secondary">{row.getValue("reference")}</Badge>;
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
