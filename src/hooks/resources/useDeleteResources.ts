import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteResources as deleteResourcesAPI } from "@/services/resources/Resources.api";

export function useDeleteResources(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteResources,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ scopeId, resourceIds }: { scopeId: string; resourceIds: string[] }) => deleteResourcesAPI(scopeId, resourceIds),
        onSuccess: (response, variables) => {
            toast.success(t(response || "resource-deleted-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["resources", variables.scopeId] });
            queryClient.invalidateQueries({ queryKey: ["resource", variables.scopeId] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { deleteResources, loading, success, isError, reset };
}
