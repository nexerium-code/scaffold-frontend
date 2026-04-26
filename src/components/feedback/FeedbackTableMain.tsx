import { useTranslation } from 'react-i18next';

import FeedbackCard from '@/components/feedback/FeedbackCard';
import { Feedback } from '@/services/feedback/feedback.api';
import { Table as TableType } from '@tanstack/react-table';

type FeedbackTableMainProps<TData> = {
    eventId: string;
    table: TableType<TData>;
};

function FeedbackTableMain<TData>({ eventId, table }: FeedbackTableMainProps<TData>) {
    const { t } = useTranslation();
    const rows = table.getFilteredRowModel().rows;

    if (rows.length === 0) {
        return <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">{t("no-feedbacks-found")}</div>;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rows.map((row) => {
                const feedback = row.original as unknown as Feedback;
                return <FeedbackCard key={row.id} eventId={eventId} feedback={feedback} />;
            })}
        </div>
    );
}

export default FeedbackTableMain;
