import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { deleteAttendees as deleteAttendeesAPI } from '@/services/attendees/Attendees.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useDeleteAttendees(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: deleteAttendees,
        isPending: loading,
        isSuccess,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, attendeeIds }: { eventId: string; attendeeIds: string[] }) => deleteAttendeesAPI(eventId, attendeeIds),
        onSuccess: (response) => {
            toast.success(t(response || "attendees-deleted-successfully"));
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

    return { deleteAttendees, loading, isError, isSuccess };
}
