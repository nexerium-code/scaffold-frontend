import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table } from '@tanstack/react-table';

type ExclusivesTableResetSelectionProps<TData> = {
    table: Table<TData>;
};

function ExclusivesTableResetSelection<TData>({ table }: ExclusivesTableResetSelectionProps<TData>) {
    const { t } = useTranslation();
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="secondary" size="icon" onClick={() => table.resetRowSelection()}>
                    <RotateCcw />
                </Button>
            </TooltipTrigger>
            <TooltipContent>{t("reset-selection")}</TooltipContent>
        </Tooltip>
    );
}

export default ExclusivesTableResetSelection;
