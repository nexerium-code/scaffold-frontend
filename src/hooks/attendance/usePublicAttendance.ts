import {
    getPublicAttendnace as getPublicAttendnaceAPI
} from '@/services/attendance/Attendance.api';
import { useQuery } from '@tanstack/react-query';

export function usePublicAttendance(eventId: string) {
    const {
        data: attendance,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["public-attendance", eventId],
        queryFn: () => getPublicAttendnaceAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { attendance, loading, isError };
}
