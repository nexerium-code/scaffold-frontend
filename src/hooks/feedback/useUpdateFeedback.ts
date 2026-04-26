import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { updateFeedback as updateFeedbackAPI } from "@/services/feedback/Feedback.api";
import { FeedbackSchemaType } from "@/services/feedback/Feedback.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFeedback(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateFeedback,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, feedbackId, payload }: { eventId: string; feedbackId: string; payload: FeedbackSchemaType }) => updateFeedbackAPI(eventId, feedbackId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "feedback-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks-stats"] });
            queryClient.invalidateQueries({ queryKey: ["feedback"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateFeedback, loading, success, isError, reset };
}
