import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateAttendeesAttended as updateAttendeesAttendedAPI } from '@/services/attendees/Attendees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAttendeesAttended(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateAttendeesAttended,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, attendeeIds }: { eventId: string; attendeeIds: string[] }) => updateAttendeesAttendedAPI(eventId, attendeeIds),
        onSuccess: (response) => {
            toast.success(t(response || "attendees-updated-successfully"));
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

    return { updateAttendeesAttended, loading, success, isError, reset };
}
