import { Calendar, CheckCheck, ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import CreateEventDialog from "@/components/events/CreateEventDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelectedEvent } from "@/contexts/event-provider";
import { useUserEvents } from "@/hooks/events/useUserEvents";
import { cn } from "@/lib/utils";

type AppEventsSwitcherProps = {
    showCreateEventButton: boolean;
};

function AppEventsSwitcher({ showCreateEventButton }: AppEventsSwitcherProps) {
    const { t } = useTranslation();
    const { state } = useSidebar();
    const { events, loading } = useUserEvents();
    const { selectedEvent, setSelectedEvent } = useSelectedEvent();
    const [createEventState, setCreateEventState] = useState(false);

    // Compute derived state
    const hasEvents = events && events.length > 0;

    // Find the chosen event object from the events array using the ID
    const chosenEvent = useMemo(() => {
        if (selectedEvent === "" || !events) return null;
        return events.find((event) => event._id === selectedEvent);
    }, [events, selectedEvent]);

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size={state === "collapsed" ? "lg" : "default"} className="w-fit" tooltip={t("events")}>
                            <div className={cn("bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm", state === "collapsed" ? "size-8" : "size-6")}>S</div>
                            <span className="max-w-30 truncate font-semibold">{chosenEvent ? chosenEvent.name : t("select-event-dots")}</span>
                            <ChevronDown />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    {loading && (
                        <DropdownMenuContent className="w-60 space-y-2 p-2" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} className="h-8 w-full" />
                            ))}
                        </DropdownMenuContent>
                    )}

                    {!loading && !hasEvents && (
                        <DropdownMenuContent className="w-60" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            <DropdownMenuLabel className="text-muted-foreground text-xs">{t("no-event-found")}</DropdownMenuLabel>
                            {showCreateEventButton && (
                                <DropdownMenuItem onSelect={() => setCreateEventState(true)}>
                                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                        <Plus />
                                    </div>
                                    {t("create-event")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    )}

                    {!loading && hasEvents && (
                        <DropdownMenuContent className="w-60" align="start" side="bottom" sideOffset={state === "collapsed" ? 8 : 4}>
                            <DropdownMenuLabel className="text-muted-foreground text-xs">{t("events")}</DropdownMenuLabel>
                            {events.map((event) => (
                                <DropdownMenuItem key={event._id} onClick={() => setSelectedEvent(event._id)} className="gap-2 p-2">
                                    <Calendar />
                                    <span className="max-w-4/5 truncate">{event.name}</span>
                                    {selectedEvent === event._id && <CheckCheck className="ms-auto" />}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            {showCreateEventButton && (
                                <DropdownMenuItem onSelect={() => setCreateEventState(true)}>
                                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                                        <Plus />
                                    </div>
                                    {t("create-event")}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
                {createEventState && <CreateEventDialog onClose={() => setCreateEventState(false)} />}
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

export default AppEventsSwitcher;
