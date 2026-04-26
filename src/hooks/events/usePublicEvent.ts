import { getPublicEvent as getPublicEventAPI } from '@/services/events/Events.api';
import { useQuery } from '@tanstack/react-query';

export function usePublicEvent(eventId: string) {
    const {
        data: event,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["public-event", eventId],
        queryFn: () => getPublicEventAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnMount: false
    });

    return { event, loading, isError };
}
