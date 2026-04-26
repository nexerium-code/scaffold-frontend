import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateAttendee as updateAttendeeAPI } from '@/services/attendees/Attendees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAttendee(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateAttendee,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, attendeeId, payload }: { eventId: string; attendeeId: string; payload: { data: object } }) => updateAttendeeAPI(eventId, attendeeId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "attendee-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["attendees"] });
            queryClient.invalidateQueries({ queryKey: ["attendee"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateAttendee, loading, success, isError, reset };
}
