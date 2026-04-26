import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { createStaff as createStaffAPI } from "@/services/staff/Staff.api";
import { StaffSchemaType } from "@/services/staff/Staff.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateStaff(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: createStaff,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, participantId, payload }: { eventId: string; participantId: string; payload: StaffSchemaType }) => createStaffAPI(eventId, participantId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "staff-created-successfully"), { duration: 5000 });
            queryClient.invalidateQueries({ queryKey: ["participants-stats"] });
            queryClient.invalidateQueries({ queryKey: ["participant-staff"] });
            queryClient.invalidateQueries({ queryKey: ["staff"] });
            successCallBack?.();
        },
        onError: (error) => {
            toast.error(t(error.message || "something-went-wrong-please-try-again-later"));
        },
        onSettled: () => {
            reset();
        }
    });

    return { createStaff, loading, success, isError, reset };
}
