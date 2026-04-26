import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { updateStaff as updateStaffAPI } from "@/services/staff/Staff.api";
import { StaffSchemaType } from "@/services/staff/Staff.schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateStaff(successCallBack?: () => void) {
    const queryClient = useQueryClient();
    const { t } = useTranslation();

    const {
        mutate: updateStaff,
        isPending: loading,
        isSuccess: success,
        isError,
        reset
    } = useMutation({
        mutationFn: ({ eventId, participantId, staffId, payload }: { eventId: string; participantId: string; staffId: string; payload: StaffSchemaType }) => updateStaffAPI(eventId, participantId, staffId, payload),
        onSuccess: (response) => {
            toast.success(t(response || "staff-updated-successfully"));
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

    return { updateStaff, loading, success, isError, reset };
}
