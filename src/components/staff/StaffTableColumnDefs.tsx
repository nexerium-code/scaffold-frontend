import { useTranslation } from "react-i18next";

import FormatActionsHeaderAndCell from "@/components/staff/StaffTableActionCell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export function StaffTableColumnDefs(eventId: string, participantId: string) {
    const columns = [...baseColumns];
    columns.push(FormatActionsHeaderAndCell(eventId, participantId));
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
            const logo = row.original.picture as string;

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
        accessorKey: "gender",
        header: () => <TranslatedHeader header="gender" />,
        cell: ({ row }) => {
            const gender = row.getValue("gender") as string;
            return <GenderCell gender={gender} />;
        }
    },
    {
        accessorKey: "identification",
        header: () => <TranslatedHeader header="identification" />,
        cell: ({ row }) => {
            return <Badge>{row.getValue("identification")}</Badge>;
        }
    },
    {
        accessorKey: "type",
        header: () => <TranslatedHeader header="type" />,
        cell: ({ row }) => {
            return <Badge variant="outline">{capitalizeFirstLetter(row.getValue("type"))}</Badge>;
        }
    }
];

function TranslatedHeader({ header }: { header: string }) {
    const { t } = useTranslation();
    return t(header);
}

function GenderCell({ gender }: { gender: string }) {
    const { t } = useTranslation();
    if (gender === "Male") return <Badge variant="outline">{t("male")}</Badge>;
    if (gender === "Female") return <Badge variant="secondary">{t("female")}</Badge>;
    return null;
}
