import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateAttendanceFormFieldsAttendees as updateAttendanceFormFieldsAttendeesAPI } from '@/services/attendance/Attendance.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAttendanceFormFieldsAttendees(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateAttendanceFormFieldsAttendees,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: object }) => updateAttendanceFormFieldsAttendeesAPI(eventId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "attendance-form-fields-attendees-updated-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["user-events"] });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["attendees"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateAttendanceFormFieldsAttendees, loading, success, isError, reset };
}
