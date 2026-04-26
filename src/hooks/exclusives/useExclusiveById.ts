import { getExclusiveById as getExclusiveByIdAPI } from '@/services/exclusives/Exclusives.api';
import { useQuery } from '@tanstack/react-query';

export function useExclusiveById(eventId: string, exclusiveId: string) {
    const {
        data: exclusive,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["exclusive", eventId, exclusiveId],
        queryFn: () => getExclusiveByIdAPI(eventId, exclusiveId),
        retry: false
    });

    return { exclusive, loading, isError };
}
