import { format } from "date-fns";
import { Check, Link, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import CopyInput from "@/components/general/CopyInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

function FormatEmailHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate underline">{value || "-"}</div>;
        }
    };
}

function FormatShortTextHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate">{value || "-"}</div>;
        }
    };
}

function FormatLongTextHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate">{value || "-"}</div>;
        }
    };
}

function FormatLinkTextHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <CopyInput icon={Link} value={value || "-"} className="max-w-56" />;
        }
    };
}

function FormatNumberHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate">{value || "-"}</div>;
        }
    };
}

function FormatPhoneHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate italic">{value || "-"}</div>;
        }
    };
}

function FormatCheckboxHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = (row.getValue(key) as string[]) || [];
            return (
                <div className="space-x-2">
                    {value.length > 0 &&
                        value.map((el, index) => (
                            <Badge key={el} variant={index % 2 === 0 ? "outline" : "secondary"}>
                                {el}
                            </Badge>
                        ))}
                    {value.length === 0 && <Badge variant="outline">-</Badge>}
                </div>
            );
        },
        filterFn: (row, id, filterValue: string[]) => {
            const rowValue = row.getValue(id) as string[];
            if (!rowValue || !Array.isArray(rowValue) || rowValue.length === 0) return false;
            if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) return true;
            // Check if any of the attendee's checkbox values match any of the filter values
            return filterValue.some((filterOption) => rowValue.some((rowOption) => rowOption === filterOption));
        }
    };
}

function FormatRadioHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <Badge>{value || "-"}</Badge>;
        },
        filterFn: "equalsString"
    };
}

function FormatSelectHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <Badge variant="outline">{value || "-"}</Badge>;
        },
        filterFn: "equalsString"
    };
}

function FormatDateHeaderAndCell(key: string, header: string): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: key,
        header: header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return value ? format(value, "P") : "-";
        }
    };
}

function FormatAttendedHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "attended",
        header: () => <TranslatedHeader header="attended" />,
        cell: ({ row }) => {
            const value = (row.getValue("attended") as boolean) || false;

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
        enableSorting: false,
        enableHiding: false
    };
}

function FormatPictureHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "picture",
        header: () => <TranslatedHeader header="picture" />,
        cell: ({ row }) => {
            const picture = row.getValue("picture") as string;
            return (
                <Avatar className="size-8 rounded-lg">
                    <AvatarImage src={picture} alt="exclusive-pic" />
                    <AvatarFallback className="bg-muted rounded-lg">pp</AvatarFallback>
                </Avatar>
            );
        }
    };
}

function FormatSelectedHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        id: "select",
        header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />,
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
        enableSorting: false,
        enableHiding: false
    };
}

function TranslatedHeader({ header, className }: { header: string; className?: string }) {
    const { t } = useTranslation();
    const content = t(header);
    if (className) return <div className={className}>{content}</div>;
    return content;
}

export {
    FormatEmailHeaderAndCell,
    FormatShortTextHeaderAndCell,
    FormatLongTextHeaderAndCell,
    FormatLinkTextHeaderAndCell,
    FormatNumberHeaderAndCell,
    FormatPhoneHeaderAndCell,
    FormatCheckboxHeaderAndCell,
    FormatRadioHeaderAndCell,
    FormatSelectHeaderAndCell,
    FormatDateHeaderAndCell,
    FormatAttendedHeaderAndCell,
    FormatPictureHeaderAndCell,
    FormatSelectedHeaderAndCell
};
