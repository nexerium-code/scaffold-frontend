import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createScope as createScopeAPI } from "@/services/scopes/Scopes.api";
import { ScopeSchemaType } from "@/services/scopes/Scopes.schemas";

export function useCreateScope(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createScope,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: (payload: ScopeSchemaType, idempotencyKey) => createScopeAPI(payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "scope-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["scopes"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createScope, loading, success, isError, reset };
}
