import { Check, MoreVertical, Pencil, Trash, Users } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateParticipantDialog from "@/components/participant/UpdateParticipantDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useApproveParticipants } from "@/hooks/participant/useApproveParticipants";
import { useDeleteParticipants } from "@/hooks/participant/useDeleteParticipants";
import { useNavigate } from "@tanstack/react-router";
import { ColumnDef } from "@tanstack/react-table";

function FormatActionsHeaderAndCell(eventId: string): ColumnDef<Record<string, unknown>> {
    return {
        id: "actions",
        cell: ({ row }) => <ActionsDropdown eventId={eventId} participantId={row.original._id as string} approved={row.original.approved as boolean} />,
        enableSorting: false,
        enableHiding: false
    };
}

type ActionsDropdownProps = {
    eventId: string;
    participantId: string;
    approved: boolean;
};

function ActionsDropdown({ eventId, participantId, approved }: ActionsDropdownProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [dialogState, setDialogState] = useState(false);
    const { approveParticipants, loading: loadingApprove } = useApproveParticipants();
    const { deleteParticipants, loading: loadingDelete } = useDeleteParticipants();

    function handleApprove() {
        approveParticipants({ eventId, participantIds: [participantId] });
    }

    function handleDelete() {
        deleteParticipants({ eventId, participantIds: [participantId] });
    }

    function handleStaffNavigation() {
        navigate({ to: "/participants/$participantId", params: { participantId } });
    }

    const isLoading = loadingApprove || loadingDelete;

    return (
        <Fragment>
            <div className="flex items-center justify-end">
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
                            <DropdownMenuItem onClick={handleStaffNavigation}>
                                <Users className="me-2" /> {t("staff")}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setDialogState(true)}>
                                <Pencil className="me-2" /> {t("edit")}
                            </DropdownMenuItem>
                            {!approved && (
                                <DropdownMenuItem onClick={handleApprove}>
                                    <Check className="me-2" /> {t("approve")}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                                <Trash className="me-2" /> {t("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {dialogState && <UpdateParticipantDialog key={participantId + eventId} eventId={eventId} participantId={participantId} onClose={() => setDialogState(false)} />}
        </Fragment>
    );
}

export default FormatActionsHeaderAndCell;
