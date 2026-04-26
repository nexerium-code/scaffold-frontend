import { IdCard, MoreVertical, Pencil, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateStaffDialog from "@/components/staff/UpdateStaffDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteStaff } from "@/hooks/staff/useDeleteStaff";
import { ColumnDef } from "@tanstack/react-table";

function FormatActionsHeaderAndCell(eventId: string, participantId: string): ColumnDef<Record<string, unknown>> {
    return {
        id: "actions",
        cell: ({ row }) => <ActionsDropdown eventId={eventId} participantId={participantId} staffId={row.original._id as string} />,
        enableSorting: false,
        enableHiding: false
    };
}

type ActionsDropdownProps = {
    eventId: string;
    participantId: string;
    staffId: string;
};

function ActionsDropdown({ eventId, participantId, staffId }: ActionsDropdownProps) {
    const { t } = useTranslation();
    const [dialogState, setDialogState] = useState(false);
    const { deleteStaff, loading: loadingDelete } = useDeleteStaff();

    function handleDelete() {
        deleteStaff({ eventId, participantId, staffIds: [staffId] });
    }

    function handleViewBadge() {
        const badgeURL = `https://sideproject-akmn-bucket.s3.me-south-1.amazonaws.com/badges/${staffId}.pdf`;
        window.open(badgeURL, "_blank", "noopener,noreferrer");
    }

    return (
        <Fragment>
            <div className="flex items-center justify-end">
                {loadingDelete && <Spinner />}
                {!loadingDelete && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleViewBadge}>
                                <IdCard className="me-2" /> {t("badge")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDialogState(true)}>
                                <Pencil className="me-2" /> {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                                <Trash className="me-2" /> {t("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {dialogState && <UpdateStaffDialog key={staffId + eventId} eventId={eventId} participantId={participantId} staffId={staffId} onClose={() => setDialogState(false)} />}
        </Fragment>
    );
}

export default FormatActionsHeaderAndCell;
