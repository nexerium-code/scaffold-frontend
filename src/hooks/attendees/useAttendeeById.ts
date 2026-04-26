import { getAttendeeById as getAttendeeByIdAPI } from '@/services/attendees/Attendees.api';
import { useQuery } from '@tanstack/react-query';

export function useAttendeeById(eventId: string, attendeeId: string) {
    const {
        data: attendee,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["attendee", eventId, attendeeId],
        queryFn: () => getAttendeeByIdAPI(eventId, attendeeId),
        retry: false
    });

    return { attendee, loading, isError };
}
