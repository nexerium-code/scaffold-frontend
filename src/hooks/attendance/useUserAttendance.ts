import { getUserAttendnace as getUserAttendnaceAPI } from '@/services/attendance/Attendance.api';
import { useQuery } from '@tanstack/react-query';

export function useUserAttendance(eventId: string) {
    const {
        data: attendance,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["attendance", eventId],
        queryFn: () => getUserAttendnaceAPI(eventId),
        enabled: !!eventId,
        retry: false,
        refetchOnWindowFocus: false
    });

    return { attendance, loading, isError };
}
