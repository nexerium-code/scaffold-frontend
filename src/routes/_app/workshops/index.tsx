import { BookOpen, GraduationCap, Mails } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import GenericError from '@/components/empty-states/GenericError';
import NoEventSelected from '@/components/empty-states/NoEventSelected';
import WorkshopSkeleton from '@/components/skeleton/WorkshopSkeleton';
import CreateWorkshopDialog from '@/components/workshop/CreateWorkshopDialog';
import WorkshopTable from '@/components/workshop/WorkshopTable';
import { useSelectedEvent } from '@/contexts/event-provider';
import { useUserEvent } from '@/hooks/events/useUserEvent';
import { useGetAllWorkshops } from '@/hooks/workshop/useGetAllWorkshop';
import { useGetWorkshopsStats } from '@/hooks/workshop/useGetWorkshopsStats';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute("/_app/workshops/")({
    component: RouteComponent
});

function RouteComponent() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading: loadingUserEvent, isError: isErrorUserEvent } = useUserEvent(selectedEvent);
    const { workshops: _, loading: loadingWorkshops, isError: isErrorWorkshops } = useGetAllWorkshops(selectedEvent);
    const { stats, loading: loadingStats, isError: isErrorStats } = useGetWorkshopsStats(selectedEvent);

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingUserEvent || loadingWorkshops || loadingStats) return <WorkshopSkeleton />;
    if (isErrorUserEvent || isErrorWorkshops || isErrorStats) return <GenericError />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {event?.name}
                    <span className="text-xl font-light italic">{t("workshops-suffix")}</span>
                </h1>
                <CreateWorkshopDialog />
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-3 md:divide-x md:divide-y-0">
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.workshopCount || 0}</h3>
                        <BookOpen className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-workshops")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("created")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.enrolleeCount || 0}</h3>
                        <Mails className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-enrollees")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("registered")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.approvedEnrolleeCount || 0}</h3>
                        <GraduationCap className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("total-approved")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("checked")}</span>
                    </div>
                </div>
            </div>
            <WorkshopTable key={`${event?._id}-workshops-table`} eventId={event?._id || ""} />
        </div>
    );
}
