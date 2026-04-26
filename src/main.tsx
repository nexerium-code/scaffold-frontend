import "@/index.css";
import "@/locales/i18n";

import { ClerkProvider } from "@clerk/clerk-react";
import { arSA, enUS } from "@clerk/localizations";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import ErrorComponent from "@/components/empty-states/ErrorComponent";
import i18n from "@/locales/i18n";
import { routeTree } from "@/routeTree.gen";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3 * 60 * 1000,
            refetchInterval: 5 * 60 * 1000
        }
    }
});

const router = createRouter({
    routeTree,
    defaultPreload: "render",
    scrollRestoration: true,
    notFoundMode: "root",
    defaultErrorComponent: ErrorComponent,
    context: { queryClient }
});

declare module "@tanstack/react-router" {
    interface Register {
        router: typeof router;
    }
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

function mainRender() {
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{ theme: shadcn }} localization={i18n.language === "en-US" ? enUS : arSA}>
                    <RouterProvider router={router} />
                </ClerkProvider>
            </QueryClientProvider>
        </StrictMode>
    );
}

mainRender();
i18n.on("languageChanged", mainRender);
