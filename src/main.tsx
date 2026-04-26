import "@/index.css";
import "@/locales/i18n";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import ErrorComponent from "@/components/empty-states/ErrorComponent";
import { routeTree } from "@/routeTree.gen";
import { ClerkProvider } from "@clerk/clerk-react";
import { arSA, enUS } from "@clerk/localizations";
import { shadcn } from "@clerk/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";

import i18n from "@/locales/i18n";

// Initialize Clerk
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_ADMINS_PUBLISHABLE_KEY;

// Initialize Query Client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 3 * 60 * 1000, // Data is fresh for 3 minutes
            refetchInterval: 5 * 60 * 1000 // Refetch data every 5 minutes
        }
    }
});

// Create a new router instance
const router = createRouter({
    routeTree,
    defaultPreload: "render",
    // defaultPreloadDelay: 500,
    // defaultPreloadStaleTime: 3 * 60 * 1000,
    scrollRestoration: true,
    notFoundMode: "root",
    defaultErrorComponent: ErrorComponent,
    context: { queryClient }
});

// Register the router instance for type safety
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

// Render the app initially and listen for language changes
mainRender();
// Listen for language changes and re-render the app
i18n.on("languageChanged", mainRender);
