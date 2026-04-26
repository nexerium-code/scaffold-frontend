import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

import UpdateResourceDialog from "@/components/resources/UpdateResourceDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteResources } from "@/hooks/resources/useDeleteResources";
import { Resource } from "@/services/resources/Resources.api";

type ResourcesTableActionCellProps = {
    resource: Resource;
};

function ResourcesTableActionCell({ resource }: ResourcesTableActionCellProps) {
    const { t } = useTranslation();
    const [updateOpen, setUpdateOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const { deleteResources, loading } = useDeleteResources(() => setDeleteOpen(false));

    function handleDelete() {
        deleteResources({ scopeId: resource.scopeId, resourceIds: [resource._id] });
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal />
                        <span className="sr-only">{t("open-menu")}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link to="/resources/$resourceId" params={{ resourceId: resource._id }}>
                                <Eye />
                                {t("view")}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setUpdateOpen(true)}>
                            <Pencil />
                            {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
                            <Trash2 />
                            {t("delete")}
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <UpdateResourceDialog open={updateOpen} onOpenChange={setUpdateOpen} scopeId={resource.scopeId} resourceId={resource._id} />
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("delete-resource")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("delete-resource-description")}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" disabled={loading} onClick={handleDelete}>
                            {t("delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default ResourcesTableActionCell;
