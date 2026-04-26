import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { createAttendance as createAttendanceAPI } from '@/services/attendance/Attendance.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateAttendance(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createAttendance,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: object }) => createAttendanceAPI(eventId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "attendance-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["user-events"] });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createAttendance, loading, success, isError, reset };
}
