import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { CodeXml } from "lucide-react";
import { useTranslation } from "react-i18next";

import CopyInput from "@/components/general/CopyInput";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { EntryType, EntryTypes, PaymentStatusType, PaymentStatusTypes } from "@/lib/enums";
import { CategorySchemaType } from "@/services/attendance/Attendance.main.schemas";

function FormatEmailCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="font-semibold underline">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatShortTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="w-max max-w-28 truncate">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatLongTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="w-max max-w-56 truncate">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatLinkTextCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{<CopyInput icon={CodeXml} value={safeValue} className="max-w-56" />}</TableCell>
        </TableRow>
    );
}

function FormatNumberCell(key: string, value: unknown) {
    const safeValue = (value as number) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatPhoneCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell className="font-semibold italic">{safeValue}</TableCell>
        </TableRow>
    );
}

function FormatCheckboxCell(key: string, value: unknown) {
    const safeValue = (value as string[]) || [];
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    {safeValue.map((el, index) => (
                        <Badge key={el} variant={index % 2 === 0 ? "outline" : "secondary"}>
                            {el}
                        </Badge>
                    ))}
                </div>
            </TableCell>
        </TableRow>
    );
}

function FormatRadioCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <Badge>{safeValue}</Badge>
            </TableCell>
        </TableRow>
    );
}

function FormatSelectCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>
                <Badge variant="outline">{safeValue}</Badge>
            </TableCell>
        </TableRow>
    );
}

function FormatDateCell(key: string, value: unknown) {
    const safeValue = (value as string) || "-";
    return (
        <TableRow>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{format(safeValue, "P")}</TableCell>
        </TableRow>
    );
}

function FormatSelectedDatesCell(selectedDates: unknown) {
    const { t } = useTranslation();
    const safeSelectedDates = (selectedDates as string[]) || [];
    return (
        <TableRow>
            <TableCell className="font-medium">{t("selected-dates")}</TableCell>
            <TableCell>
                <div className="flex max-w-70 flex-wrap gap-2">
                    {safeSelectedDates.map((date) => (
                        <Badge key={date} variant="outline">
                            {format(date, "P")}
                        </Badge>
                    ))}
                </div>
            </TableCell>
        </TableRow>
    );
}

function FormatEntriesCell(entries: { value: string; type: EntryType }[]) {
    const { t } = useTranslation();
    return (
        <TableRow>
            <TableCell className="align-top font-medium">{t("entries")}</TableCell>
            <TableCell>
                {entries.length === 0 && <Badge variant="destructive">{t("none")}</Badge>}
                {entries.length > 0 && (
                    <div className="flex max-h-70 max-w-70 flex-wrap gap-2 overflow-y-auto">
                        {entries.map((entry) => (
                            <Badge key={entry.value} variant="outline" className={`${entry.type === EntryTypes.IN ? "bg-sky-200" : "bg-purple-200"}`}>
                                {entry.type} : {format(toZonedTime(new Date(entry.value), "Asia/Riyadh"), "PPP pp")}
                            </Badge>
                        ))}
                    </div>
                )}
            </TableCell>
        </TableRow>
    );
}

function FormatPaymentIdCell(paymentId: string) {
    const { t } = useTranslation();
    return (
        <TableRow>
            <TableCell className="font-medium">{t("payment-id")}</TableCell>
            <TableCell className="w-max max-w-56 truncate">{paymentId}</TableCell>
        </TableRow>
    );
}

function FormatPaymentStatusCell(paymentStatus: PaymentStatusType) {
    const { t } = useTranslation();
    function getPaymentStatus() {
        if (paymentStatus === PaymentStatusTypes.PAID) return <Badge>{t("paid")}</Badge>;
        if (paymentStatus === PaymentStatusTypes.PENDING) return <Badge variant="outline">{t("pending")}</Badge>;
        if (paymentStatus === PaymentStatusTypes.FAILED) return <Badge variant="destructive">{t("failed")}</Badge>;
        return <Badge variant="secondary">-</Badge>;
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{t("payment-status")}</TableCell>
            <TableCell>{getPaymentStatus()}</TableCell>
        </TableRow>
    );
}

function FormatPaymentCategoryCell(category: CategorySchemaType) {
    const { t } = useTranslation();

    return (
        <TableRow>
            <TableCell className="font-medium">{t("payment-category")}</TableCell>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.name}</Badge>
                    <Badge variant="outline">
                        {category.price} {t("sar")}
                    </Badge>
                </div>
            </TableCell>
        </TableRow>
    );
}

export { FormatSelectedDatesCell, FormatEntriesCell, FormatPaymentIdCell, FormatPaymentStatusCell, FormatPaymentCategoryCell, FormatEmailCell, FormatShortTextCell, FormatLongTextCell, FormatLinkTextCell, FormatNumberCell, FormatPhoneCell, FormatCheckboxCell, FormatRadioCell, FormatSelectCell, FormatDateCell };
