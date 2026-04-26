import { format } from "date-fns";
import { Check, CodeXml, Link, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import CopyInput from "@/components/general/CopyInput";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentStatusType, PaymentStatusTypes } from "@/lib/enums";
import { CategorySchemaType } from "@/services/attendance/Attendance.main.schemas";
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
        header: () => header,
        cell: ({ row }) => {
            const value = row.getValue(key) as string;
            return <div className="w-max max-w-56 truncate text-center">{value || "-"}</div>;
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

function FormatSelectedDatesHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "selectedDates",
        header: () => <TranslatedHeader header="selected-dates" />,
        cell: ({ row }) => {
            const attendeeId = row.original._id as string;
            const selectedDates = (row.getValue("selectedDates") as string[]) || [];

            if (selectedDates.length === 0) return <Badge variant="outline">-</Badge>;

            if (selectedDates.length === 1) return <Badge variant="secondary">{format(selectedDates[0], "P")}</Badge>;

            return (
                <div className="flex max-w-70 flex-wrap gap-2">
                    {selectedDates.map((date) => (
                        <Badge key={`${attendeeId}-${date}`} variant="outline">
                            {format(date, "P")}
                        </Badge>
                    ))}
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
        filterFn: (row, id, filterValue: string[]) => {
            const rowValue = row.getValue(id) as string[];
            if (!rowValue || !Array.isArray(rowValue) || rowValue.length === 0) return false;
            if (!filterValue || !Array.isArray(filterValue) || filterValue.length === 0) return true;
            // Check if any of the selectedDates of the attendee match any of the filter values
            return filterValue.some((filterDate) => rowValue.some((rowDate) => rowDate === filterDate));
        }
    };
}

function FormatPaymentIdHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "paymentId",
        header: () => <TranslatedHeader header="payment-id" />,
        cell: ({ row }) => {
            return <CopyInput icon={CodeXml} value={row.getValue("paymentId")} className="max-w-56" />;
        },
        enableSorting: false,
        enableHiding: false
    };
}

function PaymentStatusCell({ paymentStatus }: { paymentStatus: PaymentStatusType }) {
    const { t } = useTranslation();
    if (paymentStatus === PaymentStatusTypes.PAID) return <Badge>{t("paid")}</Badge>;
    if (paymentStatus === PaymentStatusTypes.PENDING) return <Badge variant="outline">{t("pending")}</Badge>;
    if (paymentStatus === PaymentStatusTypes.FAILED) return <Badge variant="destructive">{t("failed")}</Badge>;
    return <Badge variant="secondary">-</Badge>;
}

function FormatPaymentStatusHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "paymentStatus",
        header: () => <TranslatedHeader header="payment-status" />,
        cell: ({ row }) => {
            const paymentStatus = row.getValue("paymentStatus") as PaymentStatusType;
            return <PaymentStatusCell paymentStatus={paymentStatus} />;
        },
        enableSorting: false,
        enableHiding: false
    };
}

function FormatPaymentCategoryHeaderAndCell(): ColumnDef<Record<string, unknown>> {
    return {
        accessorKey: "category",
        header: () => <TranslatedHeader header="payment-category" />,
        cell: ({ row }) => {
            const category = row.getValue("category") as CategorySchemaType;
            return <PaymentCategoryCell category={category} />;
        },
        enableSorting: false,
        enableHiding: false
    };
}

function PaymentCategoryCell({ category }: { category: CategorySchemaType }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline">{category.name}</Badge>
            <Badge variant="outline">
                {category.price} {t("sar")}
            </Badge>
        </div>
    );
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

function TranslatedHeader({ header }: { header: string }) {
    const { t } = useTranslation();
    return t(header);
}

export {
    FormatSelectedDatesHeaderAndCell,
    FormatAttendedHeaderAndCell,
    FormatPaymentIdHeaderAndCell,
    FormatPaymentStatusHeaderAndCell,
    FormatPaymentCategoryHeaderAndCell,
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
    FormatSelectedHeaderAndCell
};
