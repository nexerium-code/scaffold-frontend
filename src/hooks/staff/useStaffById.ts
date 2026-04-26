import { getStaffById as getStaffByIdAPI } from "@/services/staff/Staff.api";
import { useQuery } from "@tanstack/react-query";

export function useStaffById(eventId: string, participantId: string, staffId: string) {
    const {
        data: staff,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["staff", eventId, participantId, staffId],
        queryFn: () => getStaffByIdAPI(eventId, participantId, staffId),
        retry: false
    });

    return { staff, loading, isError };
}
