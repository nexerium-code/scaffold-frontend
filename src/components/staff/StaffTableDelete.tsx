import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteStaff } from "@/hooks/staff/useDeleteStaff";
import { Table } from "@tanstack/react-table";

type StaffTableDeleteProps<TData> = {
    eventId: string;
    participantId: string;
    table: Table<TData>;
};

function StaffTableDelete<TData>({ eventId, participantId, table }: StaffTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteStaff, loading: loadingDelete } = useDeleteStaff(() => table.resetRowSelection());

    const selectedStaff = Object.keys(table.getState().rowSelection);

    function handleDelete() {
        deleteStaff({ eventId, participantId, staffIds: selectedStaff });
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
                        <AlertDialogTitle>{t("delete-staff")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-staff-confirm", { count: selectedStaff.length })}</AlertDialogDescription>
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
                {t("delete-count-staff", { count: selectedStaff.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default StaffTableDelete;
