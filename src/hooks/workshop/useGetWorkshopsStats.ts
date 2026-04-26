import { getWorkshopStats as getWorkshopsStatsAPI } from '@/services/workshop/Workshop.api';
import { useQuery } from '@tanstack/react-query';

export function useGetWorkshopsStats(eventId: string) {
    const {
        data: stats,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["workshops-stats", eventId],
        queryFn: () => getWorkshopsStatsAPI(eventId),
        retry: false
    });

    return { stats, loading, isError };
}
