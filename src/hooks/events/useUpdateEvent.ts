import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateEvent as updateEventAPI } from '@/services/events/Events.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateEvent(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateEvent,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: object }) => updateEventAPI(eventId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "event-creation-submitted-successfully-pending-approval"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["user-events"] });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateEvent, loading, success, isError, reset };
}
