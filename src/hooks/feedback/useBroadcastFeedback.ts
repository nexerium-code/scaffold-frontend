import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { broadcastFeedback as broadcastFeedbackAPI } from "@/services/feedback/Feedback.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useBroadcastFeedback() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: broadcastFeedback,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, feedbackId }: { eventId: string; feedbackId: string }) => broadcastFeedbackAPI(eventId, feedbackId),
        onSuccess: (response) => {
            const { emailsSent, totalRecipients } = response;

            if (emailsSent === 0 && totalRecipients > 0) {
                toast.error(t("feedback-broadcasted-failed", { emailsSent, totalRecipients }), { duration: 8000 });
            } else if (emailsSent === totalRecipients) {
                toast.success(t("feedback-broadcasted-successfully", { emailsSent, totalRecipients }), { duration: 8000 });
            } else if (emailsSent > 0 && emailsSent < totalRecipients) {
                toast.info(t("feedback-broadcasted-partially", { emailsSent, totalRecipients }), { duration: 8000 });
            }

            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks-stats"] });
            queryClient.invalidateQueries({ queryKey: ["feedback"] });
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"), { duration: 5000 });
        },
        onSettled: () => {
            reset();
        }
    });

    return { broadcastFeedback, loading, isError, isSuccess };
}
