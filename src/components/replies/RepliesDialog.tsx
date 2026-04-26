import { useTranslation } from "react-i18next";

import RepliesTable from "@/components/replies/RepliesTable";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Feedback } from "@/services/feedback/Feedback.api";

type RepliesDialogProps = {
    eventId: string;
    feedback: Feedback;
    onClose: (value: boolean) => void;
};

function RepliesDialog({ eventId, feedback, onClose }: RepliesDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog defaultOpen onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] max-w-4xl! overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("feedback-replies")}</DialogTitle>
                    <DialogDescription>{t("feedback-replies-description", { title: feedback.title })}</DialogDescription>
                </DialogHeader>
                <RepliesTable key={eventId} eventId={eventId} feedbackId={feedback._id} />
            </DialogContent>
        </Dialog>
    );
}

export default RepliesDialog;
