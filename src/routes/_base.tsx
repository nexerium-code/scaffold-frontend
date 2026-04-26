import { SignedOut, useAuth } from "@clerk/clerk-react";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import SpinnerPage from "@/components/general/SpinnerPage";

export const Route = createFileRoute("/_base")({
    component: BaseLayout
});

function BaseLayout() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return <SpinnerPage />;
    if (isSignedIn) return <Navigate to="/dashboard" replace />;

    return (
        <SignedOut>
            <Outlet />
        </SignedOut>
    );
}
