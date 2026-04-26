import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createExclusive as createExclusiveAPI } from "@/services/exclusives/Exclusives.api";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateExclusive(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createExclusive,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: { picture: File | string; data: object } }, idempotencyKey) => createExclusiveAPI(eventId, payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "exclusive-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["exclusives"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createExclusive, loading, success, isError, reset };
}
