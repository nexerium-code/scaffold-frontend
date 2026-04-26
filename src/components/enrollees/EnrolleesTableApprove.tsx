import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useApproveEnrollees } from '@/hooks/enrollees/useApproveEnrollees';
import { Table } from '@tanstack/react-table';

type EnrolleesTableApproveProps<TData> = {
    eventId: string;
    workshopId: string;
    table: Table<TData>;
};

function EnrolleesTableApprove<TData>({ eventId, workshopId, table }: EnrolleesTableApproveProps<TData>) {
    const { t } = useTranslation();
    const { approveEnrollees, loading: loadingApprove } = useApproveEnrollees(() => table.resetRowSelection());

    const selectedEnrollees = Object.keys(table.getState().rowSelection);

    function handleApprove() {
        approveEnrollees({ eventId, workshopId, enrolleeIds: selectedEnrollees });
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
                        <AlertDialogTitle>{t("approve-enrollees")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("approve-enrollees-confirm", { count: selectedEnrollees.length })}</AlertDialogDescription>
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
                {t("approve-count-enrollees", { count: selectedEnrollees.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default EnrolleesTableApprove;
