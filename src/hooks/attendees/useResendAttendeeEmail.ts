import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { resendAttendeeEmail as resendAttendeeEmailAPI } from '@/services/attendees/Attendees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useResendAttendeeEmail(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: resendAttendeeEmail,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, attendeeId }: { eventId: string; attendeeId: string }) => resendAttendeeEmailAPI(eventId, attendeeId),
        onSuccess: (response) => {
            toast.success(t(response || "attendee-email-resent-successfully"));
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

    return { resendAttendeeEmail, loading, success, isError, reset };
}
