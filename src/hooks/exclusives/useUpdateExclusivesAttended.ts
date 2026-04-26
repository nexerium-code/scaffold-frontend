import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateExclusivesAttended as updateExclusivesAttendedAPI } from '@/services/exclusives/Exclusives.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateExclusivesAttended(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateExclusivesAttended,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, exclusiveIds }: { eventId: string; exclusiveIds: string[] }) => updateExclusivesAttendedAPI(eventId, exclusiveIds),
        onSuccess: (response) => {
            toast.success(t(response || "exclusives-updated-successfully"));
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

    return { updateExclusivesAttended, loading, success, isError, reset };
}
