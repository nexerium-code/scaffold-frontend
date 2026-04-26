import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { createEnrollee as createEnrolleeAPI } from '@/services/enrollees/Enrollees.api';
import { EnrolleeSchemaType } from '@/services/enrollees/Enrollees.schemas';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateEnrollee(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createEnrollee,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, workshopId, payload }: { eventId: string; workshopId: string; payload: EnrolleeSchemaType }) => createEnrolleeAPI(eventId, workshopId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "enrollee-created-successfully"), { duration: 5000 });
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

    return { createEnrollee, loading, success, isError, reset };
}
