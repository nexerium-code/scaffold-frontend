import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateResource as updateResourceAPI } from "@/services/resources/Resources.api";
import { ResourceSchemaType } from "@/services/resources/Resources.schemas";

export function useUpdateResource(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateResource,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ scopeId, resourceId, payload }: { scopeId: string; resourceId: string; payload: ResourceSchemaType }) => updateResourceAPI(scopeId, resourceId, payload),
        onSuccess: (response, variables) => {
            toast.success(t(response || "resource-updated-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["resources", variables.scopeId] });
            queryClient.invalidateQueries({ queryKey: ["resource", variables.scopeId, variables.resourceId] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateResource, loading, success, isError, reset };
}
