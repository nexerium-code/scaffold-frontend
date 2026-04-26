import { getUserEvents as getUserEventsAPI } from '@/services/events/Events.api';
import { useQuery } from '@tanstack/react-query';

export function useUserEvents() {
    const {
        data: events,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["user-events"],
        queryFn: () => getUserEventsAPI(),
        select: (data) => data?.reverse(),
        retry: false
    });

    return { events, loading, isError };
}
