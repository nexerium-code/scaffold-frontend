import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createResource as createResourceAPI } from "@/services/resources/Resources.api";
import { ResourceSchemaType } from "@/services/resources/Resources.schemas";

export function useCreateResource(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createResource,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: ({ scopeId, payload }: { scopeId: string; payload: ResourceSchemaType }, idempotencyKey) => createResourceAPI(scopeId, payload, idempotencyKey),
        onSuccess: (response, variables) => {
            toast.success(t(response || "resource-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["resources", variables.scopeId] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createResource, loading, success, isError, reset };
}
