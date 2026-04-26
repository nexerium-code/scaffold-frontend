import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteExclusives } from "@/hooks/exclusives/useDeleteExclusives";
import { Table } from "@tanstack/react-table";

type ExclusivesTableDeleteProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function ExclusivesTableDelete<TData>({ eventId, table }: ExclusivesTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteExclusives, loading: loadingDelete } = useDeleteExclusives(() => table.resetRowSelection());

    const selectedExclusives = Object.keys(table.getState().rowSelection);

    function handleDelete() {
        deleteExclusives({ eventId, exclusiveIds: selectedExclusives });
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
                        <AlertDialogTitle>{t("delete-exclusives")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-exclusives-confirm", { count: selectedExclusives.length })}</AlertDialogDescription>
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
                {t("delete-count", { count: selectedExclusives.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default ExclusivesTableDelete;
