import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { updateParticipant as updateParticipantAPI } from "@/services/participant/Participant.api";
import { ParticipantSchemaType } from "@/services/participant/Participant.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateParticipant(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateParticipant,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, participantId, payload }: { eventId: string; participantId: string; payload: ParticipantSchemaType }) => updateParticipantAPI(eventId, participantId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "participant-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["participant-staff"] });
            queryClient.invalidateQueries({ queryKey: ["participant"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateParticipant, loading, success, isError, reset };
}
