import { getEnrolleeById as getEnrolleeByIdAPI } from '@/services/enrollees/Enrollees.api';
import { useQuery } from '@tanstack/react-query';

export function useGetEnrolleeById(eventId: string, workshopId: string, enrolleeId: string) {
    const {
        data: enrollee,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["enrollee", eventId, workshopId, enrolleeId],
        queryFn: () => getEnrolleeByIdAPI(eventId, workshopId, enrolleeId),
        retry: false
    });

    return { enrollee, loading, isError };
}
