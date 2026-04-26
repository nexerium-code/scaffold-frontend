import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { updateProvision as updateProvisionAPI } from '@/services/provision/Provision.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateProvision(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateProvision,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: object }) => updateProvisionAPI(eventId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "provision-updated-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["provision"] });
            queryClient.invalidateQueries({ queryKey: ["public-provision"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { updateProvision, loading, success, isError, reset };
}
