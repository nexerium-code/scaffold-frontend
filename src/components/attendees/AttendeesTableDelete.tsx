import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteAttendees } from "@/hooks/attendees/useDeleteAttendees";
import { Table } from "@tanstack/react-table";

type AttendeesTableDeleteProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function AttendeesTableDelete<TData>({ eventId, table }: AttendeesTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteAttendees, loading: loadingDelete } = useDeleteAttendees(() => table.resetRowSelection());

    const selectedAttendees = Object.keys(table.getState().rowSelection);

    function handleDelete() {
        deleteAttendees({ eventId, attendeeIds: selectedAttendees });
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
                        <AlertDialogTitle>{t("delete-attendees")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-attendees-confirm", { count: selectedAttendees.length })}</AlertDialogDescription>
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
                {t("delete-count", { count: selectedAttendees.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default AttendeesTableDelete;
