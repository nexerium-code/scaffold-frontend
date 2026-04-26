import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateAttendanceMain as updateAttendanceMainAPI } from '@/services/attendance/Attendance.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateAttendanceMain(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateAttendanceMain,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: object }) => updateAttendanceMainAPI(eventId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "attendance-updated-successfully"), { duration: 5000 });
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

    return { updateAttendanceMain, loading, success, isError, reset };
}
