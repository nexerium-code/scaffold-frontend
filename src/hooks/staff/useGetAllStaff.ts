import { getAllStaff as getAllStaffAPI } from "@/services/staff/Staff.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetAllStaff(eventId: string, participantId: string) {
    const {
        data: staff,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["participant-staff", eventId, participantId],
        queryFn: () => getAllStaffAPI(eventId, participantId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { staff, loading, isError };
}
