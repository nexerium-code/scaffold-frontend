import { getAttendnaceStats as getAttendnaceStatsAPI } from '@/services/attendance/Attendance.api';
import { useQuery } from '@tanstack/react-query';

export function useGetAttendanceStats(eventId: string) {
    const {
        data: stats,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["attendance-stats", eventId],
        queryFn: () => getAttendnaceStatsAPI(eventId),
        enabled: !!eventId,
        retry: false
    });

    return { stats, loading, isError };
}
