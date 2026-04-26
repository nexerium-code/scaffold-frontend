import { getPublicProvision as getPublicProvisionAPI } from '@/services/provision/Provision.api';
import { useQuery } from '@tanstack/react-query';

export function usePublicProvision(eventId: string) {
    const {
        data: provision,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["public-provision", eventId],
        queryFn: () => getPublicProvisionAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { provision, loading, isError };
}
