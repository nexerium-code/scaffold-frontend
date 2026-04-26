import { Calendar as CalendarIcon, CheckLine, Code, CodeXml, Mail, UserPlus, UserStar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import UpdateAttendanceFormFieldsAttendeesDialog from "@/components/attendance/UpdateAttendanceFormFieldsAttendeesDialog";
import UpdateAttendanceFormFieldsExclusivesDialog from "@/components/attendance/UpdateAttendanceFormFieldsExclusivesDialog";
import UpdateAttendanceMainDialog from "@/components/attendance/UpdateAttendnaceMainDialog";
import AttendeesTable from "@/components/attendees/AttendeesTable";
import NoAttendanceFound from "@/components/empty-states/NoAttendanceFound";
import NoEventSelected from "@/components/empty-states/NoEventSelected";
import ExclusivesTable from "@/components/exclusives/ExclusivesTable";
import CopyInput from "@/components/general/CopyInput";
import AttendanceSkeleton from "@/components/skeleton/AttendanceSkeleton";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useGetAttendanceStats } from "@/hooks/attendance/useGetAttendanceStats";
import { useUserAttendance } from "@/hooks/attendance/useUserAttendance";
import { useUserEvent } from "@/hooks/events/useUserEvent";
import { cn } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/attendance")({
    component: RouteComponent
});

function RouteComponent() {
    const { t } = useTranslation();
    const { selectedEvent } = useSelectedEvent();
    const { event, loading: loadingUserEvent } = useUserEvent(selectedEvent);
    const { attendance, loading: loadingUserAttendance, isError } = useUserAttendance(selectedEvent);
    const { stats, loading: loadingStats } = useGetAttendanceStats(selectedEvent);

    const [tab, setTab] = useState("attendees");

    if (!selectedEvent) return <NoEventSelected />;
    if (loadingUserEvent || loadingUserAttendance || loadingStats) return <AttendanceSkeleton />;
    if (isError) return <NoAttendanceFound />;

    return (
        <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
                    {event?.name}
                    <span className="text-base font-light italic md:text-lg lg:text-xl">{t("attendance-suffix")}</span>
                </h1>
                <ButtonGroup>
                    <Button className="bg-primary text-primary-foreground">{attendance?.type}</Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <CalendarIcon /> {t("dates")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-max p-0" align="end">
                            <Calendar
                                mode="multiple"
                                selected={attendance?.dates?.map((dateItem) => new Date(dateItem.value)) || []}
                                modifiers={{
                                    active: attendance?.dates?.filter((dateItem) => dateItem.active).map((dateItem) => new Date(dateItem.value)) || [],
                                    inactive: attendance?.dates?.filter((dateItem) => !dateItem.active).map((dateItem) => new Date(dateItem.value)) || []
                                }}
                                modifiersStyles={{
                                    inactive: {
                                        opacity: 0.5
                                    }
                                }}
                                onSelect={() => {}}
                            />
                        </PopoverContent>
                    </Popover>
                    <Button className={cn("text-white", attendance?.publish ? "bg-green-700" : "bg-red-700")}>{attendance?.publish ? t("public") : t("private")}</Button>
                    <UpdateAttendanceMainDialog />
                </ButtonGroup>
            </div>
            <Separator />
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="grid w-full gap-2">
                    <Label>{t("registration-endpoint")}</Label>
                    <CopyInput value={`${import.meta.env.VITE_BE_ENDPOINT}/attendees/${event?._id}/${attendance?.type?.toLowerCase()}`} icon={CodeXml} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("sender-email")}</Label>
                    <CopyInput value={`${attendance?.senderEmail}`} icon={Mail} />
                </div>
                <div className="grid w-full gap-2">
                    <Label>{t("attendance-code")}</Label>
                    <CopyInput value={`${attendance?.code}`} icon={Code} />
                </div>
            </div>
            <div className="grid grid-cols-1 divide-y rounded-md border md:grid-cols-4 md:divide-x md:divide-y-0">
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.registeredAttendees || 0}</h3>
                        <UserPlus className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("attendees")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("registered")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.attendedAttendees || 0}</h3>
                        <CheckLine className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("attendees")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("attended")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.registeredExclusives || 0}</h3>
                        <UserStar className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("exclusives")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("created")}</span>
                    </div>
                </div>
                <div className="hover:bg-muted space-y-4 px-6 py-4 transition-colors md:border-t lg:border-t-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-foreground text-2xl font-medium tracking-tight md:text-3xl">{stats?.attendedExclusives || 0}</h3>
                        <CheckLine className="text-muted-foreground size-5" />
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-muted-foreground text-sm font-medium">{t("exclusives")}</p>
                        <span className="text-muted-foreground text-sm italic underline">{t("attended")}</span>
                    </div>
                </div>
            </div>
            <Tabs value={tab} onValueChange={setTab}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="attendees">{t("attendees")}</TabsTrigger>
                        <TabsTrigger value="exclusives">{t("exclusives")}</TabsTrigger>
                    </TabsList>
                    {tab === "attendees" && <UpdateAttendanceFormFieldsAttendeesDialog />}
                    {tab === "exclusives" && <UpdateAttendanceFormFieldsExclusivesDialog />}
                </div>
                <TabsContent value="attendees" className="flex flex-col gap-2 pt-2">
                    <AttendeesTable key={`${event?._id}-attendees-table`} eventId={event?._id || ""} />
                </TabsContent>
                <TabsContent value="exclusives" className="pt-2">
                    <ExclusivesTable key={`${event?._id}-exclusives-table`} eventId={event?._id || ""} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
