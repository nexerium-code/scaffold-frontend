import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createWorkshop as createWorkshopAPI } from "@/services/workshop/Workshop.api";
import { WorkshopSchemaType } from "@/services/workshop/Workshop.schemas";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateWorkshop(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createWorkshop,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: WorkshopSchemaType }, idempotencyKey) => createWorkshopAPI(eventId, payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "workshop-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["workshops"] });
            queryClient.invalidateQueries({ queryKey: ["workshops-stats"] });
            queryClient.invalidateQueries({ queryKey: ["workshop"] });
            queryClient.invalidateQueries({ queryKey: ["workshop-enrollees"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createWorkshop, loading, success, isError, reset };
}
