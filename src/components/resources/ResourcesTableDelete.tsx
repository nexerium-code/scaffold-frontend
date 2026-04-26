import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Table } from "@tanstack/react-table";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDeleteResources } from "@/hooks/resources/useDeleteResources";
import { Resource } from "@/services/resources/Resources.api";

type ResourcesTableDeleteProps<TData> = {
    scopeId: string;
    table: Table<TData>;
};

function ResourcesTableDelete<TData>({ scopeId, table }: ResourcesTableDeleteProps<TData>) {
    const { t } = useTranslation();
    const { deleteResources, loading } = useDeleteResources(() => table.resetRowSelection());
    const selectedResources = table.getFilteredSelectedRowModel().rows.map((row) => row.original as Resource);

    function handleDelete() {
        deleteResources({ scopeId, resourceIds: selectedResources.map((resource) => resource._id) });
    }

    return (
        <AlertDialog>
            <Tooltip>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                            <Trash2 />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent>{t("delete-resources")}</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("delete-resources")}</AlertDialogTitle>
                    <AlertDialogDescription>{t("delete-resources-description", { count: selectedResources.length })}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" disabled={loading} onClick={handleDelete}>
                        {t("delete")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ResourcesTableDelete;
