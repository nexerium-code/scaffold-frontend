import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { approveParticipants as approveParticipantsAPI } from '@/services/participant/Participant.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useApproveParticipants(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: approveParticipants,
        isPending: loading,
        isError,
        isSuccess,
        reset
    } = useMutation({
        mutationFn: ({ eventId, participantIds }: { eventId: string; participantIds: string[] }) => approveParticipantsAPI(eventId, participantIds),
        onSuccess: (response) => {
            toast.success(t(response || "participants-approved-successfully"));
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

    return { approveParticipants, loading, isError, isSuccess };
}
