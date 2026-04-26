import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateEnrollee as updateEnrolleeAPI } from '@/services/enrollees/Enrollees.api';
import { EnrolleeSchemaType } from '@/services/enrollees/Enrollees.schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateEnrollee(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateEnrollee,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, workshopId, enrolleeId, payload }: { eventId: string; workshopId: string; enrolleeId: string; payload: EnrolleeSchemaType }) => updateEnrolleeAPI(eventId, workshopId, enrolleeId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "enrollee-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["enrollees"] });
            queryClient.invalidateQueries({ queryKey: ["enrollee"] });
            queryClient.invalidateQueries({ queryKey: ["workshops"] });
            queryClient.invalidateQueries({ queryKey: ["workshops-stats"] });
            queryClient.invalidateQueries({ queryKey: ["workshop"] });
            queryClient.invalidateQueries({ queryKey: ["workshop-enrollees"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateEnrollee, loading, success, isError, reset };
}
