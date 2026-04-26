import { Check, MoreVertical, Pencil, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateEnrolleeDialog from "@/components/enrollees/UpdateEnrolleeDialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useApproveEnrollees } from "@/hooks/enrollees/useApproveEnrollees";
import { useDeleteEnrollees } from "@/hooks/enrollees/useDeleteEnrollees";
import { ColumnDef } from "@tanstack/react-table";

function FormatActionsHeaderAndCell(eventId: string, workshopId: string): ColumnDef<Record<string, unknown>> {
    return {
        id: "actions",
        cell: ({ row }) => <ActionsDropdown eventId={eventId} workshopId={workshopId} enrolleeId={row.original._id as string} approved={row.original.approved as boolean} />,
        enableSorting: false,
        enableHiding: false
    };
}

type ActionsDropdownProps = {
    eventId: string;
    workshopId: string;
    enrolleeId: string;
    approved: boolean;
};

function ActionsDropdown({ eventId, workshopId, enrolleeId, approved }: ActionsDropdownProps) {
    const { t } = useTranslation();
    const [dialogState, setDialogState] = useState(false);
    const { approveEnrollees, loading: loadingApprove } = useApproveEnrollees();
    const { deleteEnrollees, loading: loadingDelete } = useDeleteEnrollees();

    function handleApprove() {
        approveEnrollees({ eventId, workshopId, enrolleeIds: [enrolleeId] });
    }

    function handleDelete() {
        deleteEnrollees({ eventId, workshopId, enrolleeIds: [enrolleeId] });
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

            {dialogState && <UpdateEnrolleeDialog key={enrolleeId + eventId} eventId={eventId} workshopId={workshopId} enrolleeId={enrolleeId} onClose={() => setDialogState(false)} />}
        </Fragment>
    );
}

export default FormatActionsHeaderAndCell;
