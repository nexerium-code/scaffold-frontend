import { CodeXml, Mails, MoreVertical, Pencil, Rocket, Trash } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateFeedbackDialog from "@/components/feedback/UpdateFeedbackDialog";
import CopyInput from "@/components/general/CopyInput";
import RepliesDialog from "@/components/replies/RepliesDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useBroadcastFeedback } from "@/hooks/feedback/useBroadcastFeedback";
import { useDeleteFeedback } from "@/hooks/feedback/useDeleteFeedback";
import { Feedback } from "@/services/feedback/Feedback.api";

type FeedbackCardProps = {
    eventId: string;
    feedback: Feedback;
};

function FeedbackCard({ eventId, feedback }: FeedbackCardProps) {
    const { t } = useTranslation();
    const [repliesDialogState, setRepliesDialogState] = useState(false);
    const [updateDialogState, setUpdateDialogState] = useState(false);
    const [broadcastDialogState, setBroadcastDialogState] = useState(false);
    const [deleteDialogState, setDeleteDialogState] = useState(false);

    const { broadcastFeedback, loading: loadingBroadcast } = useBroadcastFeedback();
    const { deleteFeedback, loading: loadingDelete } = useDeleteFeedback();

    function handleBroadcast() {
        broadcastFeedback({ eventId: feedback.eventId, feedbackId: feedback._id });
        setBroadcastDialogState(false);
    }

    function handleDelete() {
        deleteFeedback({ eventId: feedback.eventId, feedbackId: feedback._id });
        setDeleteDialogState(false);
    }

    const isLoading = loadingBroadcast || loadingDelete;

    return (
        <Fragment>
            <Card className="gap-0 py-0">
                <CardHeader className="border-b p-4 py-2!">
                    <div className="flex min-w-0 items-center justify-between gap-2">
                        <CardTitle className="flex min-w-0 items-center gap-2 italic">
                            <span className="truncate">{feedback.title}</span>
                            <Badge className={`shrink-0 text-white ${feedback.publish ? "bg-green-700" : "bg-red-700"}`}>{feedback.publish ? t("public") : t("private")}</Badge>
                        </CardTitle>
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
                                    <DropdownMenuItem onClick={() => setRepliesDialogState(true)}>
                                        <Mails className="me-2 size-4" /> {t("replies")}
                                    </DropdownMenuItem>
                                    {feedback.publish && (
                                        <DropdownMenuItem onClick={() => setBroadcastDialogState(true)}>
                                            <Rocket className="me-2 size-4" /> {t("broadcast")}
                                        </DropdownMenuItem>
                                    )}
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
                    <div className="space-y-4 overflow-hidden rounded-md border px-4 py-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-foreground text-lg font-medium tracking-tight tabular-nums">{feedback.totalReplies}</h3>
                            <Mails className="text-muted-foreground size-4" />
                        </div>
                        <div className="text-muted-foreground flex items-end justify-between text-xs font-medium">
                            <p>{t("replies")}</p>
                            <span className="text-xs font-light italic underline">{t("total")}</span>
                        </div>
                    </div>
                    <CopyInput icon={CodeXml} value={`${import.meta.env.VITE_BE_ENDPOINT}/replies/${eventId}/${feedback._id}`} />
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(feedback.target)
                            .filter(([, value]) => Boolean(value))
                            .map(([key]) => (
                                <Badge key={key} variant="outline">
                                    {t(key)}
                                </Badge>
                            ))}
                    </div>
                </CardContent>
            </Card>
            {updateDialogState && <UpdateFeedbackDialog key={feedback._id + eventId} eventId={eventId} feedbackId={feedback._id} onClose={() => setUpdateDialogState(false)} />}
            {broadcastDialogState && (
                <AlertDialog open={broadcastDialogState} onOpenChange={setBroadcastDialogState}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("broadcast-feedback")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("broadcast-feedback-confirm")}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleBroadcast}>{t("broadcast")}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            {deleteDialogState && (
                <AlertDialog open={deleteDialogState} onOpenChange={setDeleteDialogState}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t("delete-feedback")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("delete-feedback-confirm")}</AlertDialogDescription>
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
            {repliesDialogState && <RepliesDialog eventId={eventId} feedback={feedback} onClose={() => setRepliesDialogState(false)} />}
        </Fragment>
    );
}

export default FeedbackCard;
