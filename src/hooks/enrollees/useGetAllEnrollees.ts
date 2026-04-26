import { getAllEnrollees as getAllEnrolleesAPI } from '@/services/enrollees/Enrollees.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllEnrollees(eventId: string, workshopId: string) {
    const {
        data: enrollees,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["enrollees", eventId, workshopId],
        queryFn: () => getAllEnrolleesAPI(eventId, workshopId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { enrollees, loading, isError };
}
