import { getAllPublicEvents as getAllPublicEventsAPI } from '@/services/events/Events.api';
import { useQuery } from '@tanstack/react-query';

export function usePublicEvents() {
    const {
        data: events,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["public-events"],
        queryFn: () => getAllPublicEventsAPI(),
        retry: false,
        refetchOnMount: false
    });

    return { events, loading, isError };
}
