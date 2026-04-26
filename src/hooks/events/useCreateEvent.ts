import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createEvent as createEventAPI } from "@/services/events/Events.api";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateEvent(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createEvent,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: (payload: object, idempotencyKey) => createEventAPI(payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "event-creation-submitted-successfully-pending-approval"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["user-events"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createEvent, loading, success, isError, reset };
}
