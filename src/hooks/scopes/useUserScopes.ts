import { useQuery } from "@tanstack/react-query";

import { getUserScopes as getUserScopesAPI } from "@/services/scopes/Scopes.api";

export function useUserScopes() {
    const {
        data: scopes,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["scopes"],
        queryFn: getUserScopesAPI,
        retry: false
    });

    return { scopes, loading, isError };
}
