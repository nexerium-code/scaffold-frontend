import AppHeader from "@/components/_app/AppHeader";
import AppSidebar from "@/components/_app/AppSidebar";
import SpinnerPage from "@/components/general/SpinnerPage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EventProvider } from "@/contexts/event-provider";
import { Show, useAuth } from "@clerk/react";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
    component: AppLayout
});

function AppLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    console.log("🚀 ~ isSignedIn (AppLayout):", isSignedIn);

    if (!isLoaded) return <SpinnerPage />;

    return (
        <Show when="signed-in" fallback={<Navigate to="/signin" replace />}>
            <EventProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className="overflow-x-hidden">
                        <AppHeader />
                        <Outlet />
                    </SidebarInset>
                </SidebarProvider>
            </EventProvider>
        </Show>
    );
}
