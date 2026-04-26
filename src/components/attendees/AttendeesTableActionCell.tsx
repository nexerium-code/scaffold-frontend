import { Banknote, Check, Mail, Maximize, MoreVertical, Pencil, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateAttendeeSheet from "@/components/attendees/UpdateAttendeeSheet";
import ViewAttendeeSheet from "@/components/attendees/ViewAttendeeSheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteAttendees } from "@/hooks/attendees/useDeleteAttendees";
import { useResendAttendeeEmail } from "@/hooks/attendees/useResendAttendeeEmail";
import { useUpdateAttendeePaymentStatus } from "@/hooks/attendees/useUpdateAttendeePaymentStatus";
import { useUpdateAttendeesAttended } from "@/hooks/attendees/useUpdateAttendeesAttended";
import { AttendanceType, AttendanceTypes } from "@/lib/enums";
import { ColumnDef } from "@tanstack/react-table";

function FormatActionsHeaderAndCell(eventId: string, attendanceType: AttendanceType): ColumnDef<Record<string, unknown>> {
    return {
        id: "actions",
        cell: ({ row }) => <AttendeesTableActionCell eventId={eventId} attendanceType={attendanceType} attendeeId={row.original._id as string} />,
        enableSorting: false,
        enableHiding: false
    };
}

type AttendeesTableActionCellProps = {
    eventId: string;
    attendanceType: AttendanceType;
    attendeeId: string;
};

function AttendeesTableActionCell({ eventId, attendanceType, attendeeId }: AttendeesTableActionCellProps) {
    const { t } = useTranslation();
    const [updateSheetState, setUpdateSheetState] = useState(false);
    const [viewSheetState, setViewSheetState] = useState(false);

    const { updateAttendeePaymentStatus, loading: loadingPayment } = useUpdateAttendeePaymentStatus();
    const { updateAttendeesAttended, loading: loadingAttended } = useUpdateAttendeesAttended();
    const { resendAttendeeEmail, loading: loadingResendEmail } = useResendAttendeeEmail();
    const { deleteAttendees, loading: loadingDelete } = useDeleteAttendees();

    function handleUpdateAttendeePaymentStatus() {
        updateAttendeePaymentStatus({ eventId, attendeeId });
    }

    function handleUpdateAttendeeAttended() {
        updateAttendeesAttended({ eventId, attendeeIds: [attendeeId] });
    }

    function handleResendAttendeeEmail() {
        resendAttendeeEmail({ eventId, attendeeId });
    }

    function handleDeleteAttendee() {
        deleteAttendees({ eventId, attendeeIds: [attendeeId] });
    }

    const isLoading = loadingPayment || loadingAttended || loadingResendEmail || loadingDelete;

    return (
        <Fragment>
            <div className="flex items-center justify-end pe-2">
                {isLoading && <Spinner />}
                {!isLoading && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={() => setViewSheetState(true)}>
                                <Maximize className="me-2" /> {t("view")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setUpdateSheetState(true)}>
                                <Pencil className="me-2" /> {t("edit")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleResendAttendeeEmail}>
                                <Mail className="me-2" />
                                {t("resend")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleUpdateAttendeeAttended}>
                                <Check className="me-2" /> {t("attended")}
                            </DropdownMenuItem>

                            <DropdownMenuItem variant="destructive" onClick={handleDeleteAttendee}>
                                <Trash className="me-2" /> {t("delete")}
                            </DropdownMenuItem>

                            {attendanceType === AttendanceTypes.PAID && (
                                <DropdownMenuItem variant="destructive" onClick={handleUpdateAttendeePaymentStatus}>
                                    <Banknote className="me-2" /> {t("settle")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {updateSheetState && <UpdateAttendeeSheet key={attendeeId} attendeeId={attendeeId} onClose={() => setUpdateSheetState(false)} />}
            {viewSheetState && <ViewAttendeeSheet key={attendeeId} attendeeId={attendeeId} onClose={() => setViewSheetState(false)} />}
        </Fragment>
    );
}

export default FormatActionsHeaderAndCell;
