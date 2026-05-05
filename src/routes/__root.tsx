import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/react";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import NotFound from "@/components/empty-states/NotFound";
import { DirectionProvider } from "@/components/ui/direction";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-provider";
import { setClerkGetToken } from "@/services/API";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient;
}>()({
    component: RootComponent,
    notFoundComponent: NotFound
});

function RootComponent() {
    const { i18n } = useTranslation();
    const { getToken } = useAuth();

    // Set the clerk get token function once at the root
    useEffect(() => {
        setClerkGetToken(getToken);
    }, [getToken]);

    const isArabic = i18n.language.startsWith("ar");
    const direction = isArabic ? "rtl" : "ltr";

    return (
        <DirectionProvider dir={direction}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <TooltipProvider>
                    <Outlet />
                    <Toaster richColors />
                    {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
                    {/* <TanStackRouterDevtools /> */}
                </TooltipProvider>
            </ThemeProvider>
        </DirectionProvider>
    );
}
