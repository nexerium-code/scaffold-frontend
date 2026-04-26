import { getUserProvision as getUserProvisionAPI } from '@/services/provision/Provision.api';
import { useQuery } from '@tanstack/react-query';

export function useUserProvision(eventId: string) {
    const {
        data: provision,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["provision", eventId],
        queryFn: () => getUserProvisionAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { provision, loading, isError };
}
