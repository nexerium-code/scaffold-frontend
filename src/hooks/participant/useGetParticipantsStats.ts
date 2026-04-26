import {
    getParticipantsStats as getParticipantsStatsAPI
} from '@/services/participant/Participant.api';
import { useQuery } from '@tanstack/react-query';

export function useGetParticipantsStats(eventId: string) {
    const {
        data: stats,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["participants-stats", eventId],
        queryFn: () => getParticipantsStatsAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { stats, loading, isError };
}
