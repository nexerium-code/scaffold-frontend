import SpinnerPage from "@/components/general/SpinnerPage";
import { SignedOut, useAuth } from "@clerk/clerk-react";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_base")({
    component: BaseLayout
});

function BaseLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    console.log("🚀 ~ isSignedIn (AppLayout):", isSignedIn);

    if (!isLoaded) return <SpinnerPage />;
    if (isSignedIn) return <Navigate to="/dashboard" replace />;

    return (
        <SignedOut>
            <Outlet />
        </SignedOut>
    );
}
