import { getAllAttendees as getAllAttendeesAPI } from '@/services/attendees/Attendees.api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useGetAllAttendees(eventId: string) {
    const {
        data: attendees,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["attendees", eventId],
        queryFn: () => getAllAttendeesAPI(eventId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { attendees, loading, isError };
}
