import { getAllWorkshops as getAllWorkshopsAPI } from '@/services/workshop/Workshop.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllWorkshops(eventId: string) {
    const {
        data: workshops,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["workshops", eventId],
        queryFn: () => getAllWorkshopsAPI(eventId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { workshops, loading, isError };
}
