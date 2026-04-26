import { getAllExclusives as getAllExclusivesAPI } from '@/services/exclusives/Exclusives.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllExclusives(eventId: string) {
    const {
        data: exclusives,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["exclusives", eventId],
        queryFn: () => getAllExclusivesAPI(eventId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { exclusives, loading, isError };
}
