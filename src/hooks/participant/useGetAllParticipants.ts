import { getAllParticipants as getAllParticipantsAPI } from "@/services/participant/Participant.api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useGetAllParticipants(eventId: string) {
    const {
        data: participants,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["participants", eventId],
        queryFn: () => getAllParticipantsAPI(eventId),
        placeholderData: keepPreviousData,
        retry: false
    });

    return { participants, loading, isError };
}
