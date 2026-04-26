import { getUserEvent as getUserEventAPI } from '@/services/events/Events.api';
import { useQuery } from '@tanstack/react-query';

export function useUserEvent(eventId: string) {
    const {
        data: event,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getUserEventAPI(eventId),
        enabled: !!eventId,
        retry: false
    });

    return { event, loading, isError };
}
