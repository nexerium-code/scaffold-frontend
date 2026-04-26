import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { deleteFeedback as deleteFeedbackAPI } from "@/services/feedback/Feedback.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteFeedback() {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteFeedback,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, feedbackId }: { eventId: string; feedbackId: string }) => deleteFeedbackAPI(eventId, feedbackId),
        onSuccess: (response) => {
            toast.success(t(response || "feedback-deleted-successfully"));
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks-stats"] });
            queryClient.invalidateQueries({ queryKey: ["feedback"] });
            queryClient.invalidateQueries({ queryKey: ["feedback-replies"] });
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteFeedback, loading, isError, isSuccess };
}
