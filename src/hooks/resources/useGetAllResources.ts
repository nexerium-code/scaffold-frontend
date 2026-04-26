import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllResources as getAllResourcesAPI } from "@/services/resources/Resources.api";

export function useGetAllResources(scopeId: string) {
    const {
        data: resources,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["resources", scopeId],
        queryFn: () => getAllResourcesAPI(scopeId),
        enabled: !!scopeId,
        placeholderData: keepPreviousData,
        retry: false,
        select: (data) => data?.reverse()
    });

    return { resources, loading, isError };
}
