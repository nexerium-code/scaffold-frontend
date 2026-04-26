import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createFeedback as createFeedbackAPI } from "@/services/feedback/Feedback.api";
import { FeedbackSchemaType } from "@/services/feedback/Feedback.schemas";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateFeedback(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createFeedback,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: FeedbackSchemaType }, idempotencyKey) => createFeedbackAPI(eventId, payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "feedback-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            queryClient.invalidateQueries({ queryKey: ["feedbacks-stats"] });
            queryClient.invalidateQueries({ queryKey: ["feedback-replies"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createFeedback, loading, success, isError, reset };
}
