import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useUpdateAttendeesAttended } from '@/hooks/attendees/useUpdateAttendeesAttended';
import { Table } from '@tanstack/react-table';

type AttendeesTableAttendedProps<TData> = {
    eventId: string;
    table: Table<TData>;
};

function AttendeesTableAttended<TData>({ eventId, table }: AttendeesTableAttendedProps<TData>) {
    const { t } = useTranslation();
    const { updateAttendeesAttended, loading: loadingAttended } = useUpdateAttendeesAttended(() => table.resetRowSelection());

    const selectedAttendees = Object.keys(table.getState().rowSelection);

    function handleAttended() {
        updateAttendeesAttended({ eventId, attendeeIds: selectedAttendees });
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
                        <AlertDialogDescription>{t("mark-attended-confirm", { count: selectedAttendees.length })}</AlertDialogDescription>
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
                {t("attended-count", { count: selectedAttendees.length })}
            </TooltipContent>
        </Tooltip>
    );
}

export default AttendeesTableAttended;
