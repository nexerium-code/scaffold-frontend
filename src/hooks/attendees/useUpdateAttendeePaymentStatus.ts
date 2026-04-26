import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateAttendeePaymentStatus as updateAttendeePaymentStatusAPI } from '@/services/attendees/Attendees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAttendeePaymentStatus(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateAttendeePaymentStatus,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, attendeeId }: { eventId: string; attendeeId: string }) => updateAttendeePaymentStatusAPI(eventId, attendeeId),
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

    return { updateAttendeePaymentStatus, loading, success, isError, reset };
}
