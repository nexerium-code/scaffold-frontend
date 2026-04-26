import { useTranslation } from "react-i18next";

import {
    FormatCheckboxCell, FormatDateCell, FormatEmailCell, FormatEntriesCell, FormatLinkTextCell, FormatLongTextCell, FormatNumberCell, FormatPaymentCategoryCell, FormatPaymentIdCell, FormatPaymentStatusCell, FormatPhoneCell, FormatRadioCell, FormatSelectCell, FormatSelectedDatesCell, FormatShortTextCell
} from "@/components/attendees/AttendeeTableCellFuncs";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import { FormInputTypes } from "@/lib/enums";
import { Attendee } from "@/services/attendees/Attendees.api";
import { FormInputSchemaType } from "@/services/form-fields/FormFields.schemas";

type AttendeeViewTableProps = {
    formFields: Record<string, FormInputSchemaType>;
    attendee: Attendee;
};

function AttendeeViewTable({ formFields, attendee }: AttendeeViewTableProps) {
    const { t, i18n } = useTranslation();

    function handleViewBadge() {
        const badgeURL = `https://sideproject-akmn-bucket.s3.me-south-1.amazonaws.com/badges/${attendee.qrCodeToken}.pdf`;
        window.open(badgeURL, "_blank", "noopener,noreferrer");
    }

    return (
        <div className="flex flex-1 flex-col justify-between gap-2 p-2">
            <Table>
                <TableBody>
                    {Object.entries(formFields).map(([key, field]) => {
                        const value = attendee.data[key];
                        // Early return
                        if (!value) return null;
                        // Format cell according to field type
                        if (FormInputTypes.EMAIL === field.type) return FormatEmailCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.SHORT_TEXT === field.type) return FormatShortTextCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.LONG_TEXT === field.type) return FormatLongTextCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.LINK === field.type) return FormatLinkTextCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.NUMBER === field.type) return FormatNumberCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.PHONE === field.type) return FormatPhoneCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.CHECKBOX === field.type) return FormatCheckboxCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.RADIO === field.type) return FormatRadioCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.SELECT === field.type) return FormatSelectCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        else if (FormInputTypes.DATE === field.type) return FormatDateCell(i18n.language === "en-US" ? field.titleEN : field.titleAR, value);
                        // Default return
                        return null;
                    })}
                    {attendee.paymentId && FormatPaymentIdCell(attendee.paymentId)}
                    {attendee.paymentStatus && FormatPaymentStatusCell(attendee.paymentStatus)}
                    {attendee.category && FormatPaymentCategoryCell(attendee.category)}
                    {attendee.selectedDates && FormatSelectedDatesCell(attendee.selectedDates)}
                    {attendee.entries && FormatEntriesCell(attendee?.entries || [])}
                </TableBody>
            </Table>
            <Button onClick={handleViewBadge}>{t("view-badge")}</Button>
        </div>
    );
}

export default AttendeeViewTable;
