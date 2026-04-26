import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useUpdateExclusivesAttended } from '@/hooks/exclusives/useUpdateExclusivesAttended';
import { Table } from '@tanstack/react-table';

type ExclusivesTableAttendedProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function ExclusivesTableAttended<TData>({ eventId, table }: ExclusivesTableAttendedProps<TData>) {
    const { t } = useTranslation();
    const { updateExclusivesAttended, loading: loadingAttended } = useUpdateExclusivesAttended(() => table.resetRowSelection());

    const selectedExclusives = Object.keys(table.getState().rowSelection);

    function handleAttended() {
        updateExclusivesAttended({ eventId, exclusiveIds: selectedExclusives });
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
                        <AlertDialogTitle>{t("mark-attended")}</AlertDialogTitle>
                        <AlertDialogDescription>{t("mark-exclusives-attended-confirm", { count: selectedExclusives.length })}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAttended} disabled={loadingAttended}>
                            {t("attended")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <TooltipContent>
                {t("attended-count", { count: selectedExclusives.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default ExclusivesTableAttended;
