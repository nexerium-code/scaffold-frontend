import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useApproveParticipants } from '@/hooks/participant/useApproveParticipants';
import { Table } from '@tanstack/react-table';

type ParticipantsTableApproveProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function ParticipantsTableApprove<TData>({ eventId, table }: ParticipantsTableApproveProps<TData>) {
    const { t } = useTranslation();
    const { approveParticipants, loading: loadingApprove } = useApproveParticipants(() => table.resetRowSelection());

    const selectedParticipants = Object.keys(table.getState().rowSelection);

    function handleApprove() {
        approveParticipants({ eventId, participantIds: selectedParticipants });
    }

    return (
        <Tooltip>
            <AlertDialog>
                <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                        <Button size="icon">
                            <Check />
                        </Button>
                    </AlertDialogTrigger>
                </TooltipTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("approve-participants")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("approve-participants-confirm", { count: selectedParticipants.length })}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleApprove} disabled={loadingApprove}>
                            {t("approve")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TooltipContent>
                {t("approve-count", { count: selectedParticipants.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default ParticipantsTableApprove;
