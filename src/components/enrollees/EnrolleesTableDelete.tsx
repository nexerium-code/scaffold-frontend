import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteEnrollees } from "@/hooks/enrollees/useDeleteEnrollees";
import { Table } from "@tanstack/react-table";

type EnrolleesTableDeleteProps<TData> = {
    eventId: string;
    workshopId: string;
    table: Table<TData>;
};

function EnrolleesTableDelete<TData>({ eventId, workshopId, table }: EnrolleesTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteEnrollees, loading: loadingDelete } = useDeleteEnrollees(() => table.resetRowSelection());

    const selectedEnrollees = Object.keys(table.getState().rowSelection);

    function handleDelete() {
        deleteEnrollees({ eventId, workshopId, enrolleeIds: selectedEnrollees });
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
                        <AlertDialogTitle>{t("delete-enrollees")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-enrollees-confirm", { count: selectedEnrollees.length })}</AlertDialogDescription>
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
                {t("delete-count-enrollees", { count: selectedEnrollees.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default EnrolleesTableDelete;
