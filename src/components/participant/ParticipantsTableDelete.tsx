import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteParticipants } from "@/hooks/participant/useDeleteParticipants";
import { Table } from "@tanstack/react-table";

type ParticipantsTableDeleteProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function ParticipantsTableDelete<TData>({ eventId, table }: ParticipantsTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteParticipants, loading: loadingDelete } = useDeleteParticipants(() => table.resetRowSelection());

    const selectedParticipants = Object.keys(table.getState().rowSelection);

    function handleDelete() {
        deleteParticipants({ eventId, participantIds: selectedParticipants });
    }

    return (
        <Tooltip>
            <AlertDialog>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("delete-participants")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-participants-confirm", { count: selectedParticipants.length })}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={loadingDelete}>
                            {t("delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TooltipContent>
                {t("delete-count-participants", { count: selectedParticipants.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default ParticipantsTableDelete;
