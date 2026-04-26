import { getParticipantById as getParticipantByIdAPI } from "@/services/participant/Participant.api";
import { useQuery } from "@tanstack/react-query";

export function useParticipantById(eventId: string, participantId: string) {
    const {
        data: participant,
        isPending: loading,
        isError
    } = useQuery({
        queryKey: ["participant", eventId, participantId],
        queryFn: () => getParticipantByIdAPI(eventId, participantId),
        retry: false
    });

    return { participant, loading, isError };
}
