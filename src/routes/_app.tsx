import { Protect, useAuth } from "@clerk/clerk-react";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import AppHeader from "@/components/_app/AppHeader";
import AppSidebar from "@/components/_app/AppSidebar";
import SpinnerPage from "@/components/general/SpinnerPage";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ScopeProvider } from "@/contexts/scope-provider";

export const Route = createFileRoute("/_app")({
    component: AppLayout
});

function AppLayout() {
    const { isLoaded } = useAuth();

    if (!isLoaded) return <SpinnerPage />;

    return (
        <Protect fallback={<Navigate to="/signin" replace />}>
            <ScopeProvider>
                <SidebarProvider>
                    <AppSidebar />
                    <SidebarInset className="overflow-x-hidden">
                        <AppHeader />
                        <Outlet />
                    </SidebarInset>
                </SidebarProvider>
            </ScopeProvider>
        </Protect>
    );
}
