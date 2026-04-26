import { useQuery } from "@tanstack/react-query";

import { getResourceById as getResourceByIdAPI } from "@/services/resources/Resources.api";

export function useResourceById(scopeId: string, resourceId: string, enabled = true) {
    const {
        data: resource,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["resource", scopeId, resourceId],
        queryFn: () => getResourceByIdAPI(scopeId, resourceId),
        enabled: enabled && !!scopeId && !!resourceId,
        retry: false
    });

    return { resource, loading, isError };
}
