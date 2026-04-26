import { Check, Maximize, MoreVertical, Pencil, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateExclusiveDialog from "@/components/exclusives/UpdateExclusiveDialog";
import ViewExclusiveSheet from "@/components/exclusives/ViewExclusiveSheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteExclusives } from "@/hooks/exclusives/useDeleteExclusives";
import { useUpdateExclusivesAttended } from "@/hooks/exclusives/useUpdateExclusivesAttended";
import { ColumnDef } from "@tanstack/react-table";

function FormatActionsHeaderAndCell(eventId: string): ColumnDef<Record<string, unknown>> {
    return {
        id: "actions",
        cell: ({ row }) => <ExclusivesTableActionCell eventId={eventId} exclusiveId={row.original._id as string} />,
        enableSorting: false,
        enableHiding: false
    };
}

type ExclusivesTableActionCellProps = {
    eventId: string;
    exclusiveId: string;
};

function ExclusivesTableActionCell({ eventId, exclusiveId }: ExclusivesTableActionCellProps) {
    const { t } = useTranslation();
    const [updateDialogState, setUpdateDialogState] = useState(false);
    const [viewSheetState, setViewSheetState] = useState(false);

    const { updateExclusivesAttended, loading: loadingAttended } = useUpdateExclusivesAttended();
    const { deleteExclusives, loading: loadingDelete } = useDeleteExclusives();

    function handleUpdateExclusiveAttended() {
        updateExclusivesAttended({ eventId, exclusiveIds: [exclusiveId] });
    }

    function handleDeleteExclusive() {
        deleteExclusives({ eventId, exclusiveIds: [exclusiveId] });
    }

    const isLoading = loadingAttended || loadingDelete;

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
                                <Maximize className="me-2 size-4" /> {t("view")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => setUpdateDialogState(true)}>
                                <Pencil className="me-2 size-4" /> {t("edit")}
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleUpdateExclusiveAttended}>
                                <Check className="me-2 size-4" /> {t("attended")}
                            </DropdownMenuItem>

                            <DropdownMenuItem variant="destructive" onClick={handleDeleteExclusive}>
                                <Trash className="me-2 size-4" /> {t("delete")}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {updateDialogState && <UpdateExclusiveDialog key={exclusiveId} exclusiveId={exclusiveId} onClose={() => setUpdateDialogState(false)} />}
            {viewSheetState && <ViewExclusiveSheet key={exclusiveId} exclusiveId={exclusiveId} onClose={() => setViewSheetState(false)} />}
        </Fragment>
    );
}

export default FormatActionsHeaderAndCell;
