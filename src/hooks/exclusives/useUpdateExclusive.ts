import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateExclusive as updateExclusiveAPI } from '@/services/exclusives/Exclusives.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateExclusive(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateExclusive,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, exclusiveId, payload }: { eventId: string; exclusiveId: string; payload: { picture: File | string; data: object } }) => updateExclusiveAPI(eventId, exclusiveId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "exclusive-updated-successfully"));
            queryClient.invalidateQueries({ queryKey: ["attendance"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-stats"] });
            queryClient.invalidateQueries({ queryKey: ["exclusives"] });
            queryClient.invalidateQueries({ queryKey: ["exclusive"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateExclusive, loading, success, isError, reset };
}
