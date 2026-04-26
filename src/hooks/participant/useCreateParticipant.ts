import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useIdempotentMutation } from "@/hooks/useIdempotentMutation";
import { createParticipant as createParticipantAPI } from "@/services/participant/Participant.api";
import { ParticipantSchemaType } from "@/services/participant/Participant.schemas";
import { useQueryClient } from "@tanstack/react-query";

export function useCreateParticipant(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createParticipant,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useIdempotentMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: ParticipantSchemaType }, idempotencyKey) => createParticipantAPI(eventId, payload, idempotencyKey),
        onSuccess: (response) => {
            toast.success(t(response || "participant-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["provision"] });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            queryClient.invalidateQueries({ queryKey: ["participants"] });
            queryClient.invalidateQueries({ queryKey: ["participant-staff"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createParticipant, loading, success, isError, reset };
}
