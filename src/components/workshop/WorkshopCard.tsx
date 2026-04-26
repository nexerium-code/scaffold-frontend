import { CodeXml, GraduationCap, Mails, MoreVertical, Pencil, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import CopyInput from "@/components/general/CopyInput";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import UpdateWorkshopDialog from "@/components/workshop/UpdateWorkshopDialog";
import { useDeleteWorkshop } from "@/hooks/workshop/useDeleteWorkshop";
import { Workshop } from "@/services/workshop/Workshop.api";
import { Link } from "@tanstack/react-router";

type WorkshopCardProps = {
    eventId: string;
    workshop: Workshop;
    index: number;
};

function WorkshopCard({ eventId, workshop, index }: WorkshopCardProps) {
    const { t, i18n } = useTranslation();

    const [updateDialogState, setUpdateDialogState] = useState(false);
    const [deleteDialogState, setDeleteDialogState] = useState(false);

    const { deleteWorkshop, loading } = useDeleteWorkshop();

    function handleDelete() {
        deleteWorkshop({ eventId, workshopId: workshop._id });
        setDeleteDialogState(false);
    }

    return (
        <Fragment>
            <Card className="hover:ring-primary relative gap-0 py-0">
                <Link to="/workshops/$workshopId" params={{ workshopId: workshop._id }} className="absolute inset-0 z-10" aria-label={t("open-workshop", { title: workshop.titleEN })} />
                <CardHeader className="border-b p-4 py-2!">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                        <CardTitle className="flex min-w-0 items-center gap-2 italic">
                            <span className="truncate">
                                {index + 1}. {i18n.language === "en-US" ? workshop.titleEN : workshop.titleAR}
                            </span>
                            <Badge className={`shrink-0 ${workshop.publish ? "bg-green-700 text-white" : "bg-red-700 text-white"}`}>{workshop.publish ? t("public") : t("private")}</Badge>
                        </CardTitle>
                        {loading && <Spinner />}
                        {!loading && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon-sm" className="z-20">
                                        <MoreVertical />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => setUpdateDialogState(true)}>
                                        <Pencil className="me-2 size-4" /> {t("edit")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogState(true)}>
                                        <Trash className="me-2 size-4" /> {t("delete")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                    <div className="grid grid-cols-2 overflow-hidden rounded-md border">
                        <div className="space-y-4 border-e px-4 py-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-foreground text-lg font-medium tracking-tight tabular-nums">{workshop.totalEnrollees}</h3>
                                <Mails className="text-muted-foreground size-4" />
                            </div>
                            <div className="text-muted-foreground flex items-end justify-between text-xs font-medium">
                                <p>{t("enrollees")}</p>
                                <span className="text-xs font-light italic underline">{t("total")}</span>
                            </div>
                        </div>
                        <div className="space-y-4 px-4 py-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-foreground text-lg font-medium tracking-tight tabular-nums">{workshop.totalApprovedEnrollees}</h3>
                                <GraduationCap className="text-muted-foreground size-4" />
                            </div>
                            <div className="text-muted-foreground flex items-end justify-between text-xs font-medium">
                                <p>{t("approved")}</p>
                                <span className="text-xs font-light italic underline">{t("total")}</span>
                            </div>
                        </div>
                    </div>
                    <CopyInput value={`${import.meta.env.VITE_BE_ENDPOINT}/enrollees/${eventId}/${workshop._id}/public`} icon={CodeXml} className="z-20" />
                </CardContent>
            </Card>
            {updateDialogState && <UpdateWorkshopDialog eventId={eventId} workshopId={workshop._id} onClose={setUpdateDialogState} />}
            {deleteDialogState && (
                <AlertDialog open={deleteDialogState} onOpenChange={setDeleteDialogState}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("delete-workshop")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("delete-workshop-confirm")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction variant="destructive" onClick={handleDelete}>
                                {t("delete")}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Fragment>
    );
}

export default WorkshopCard;
