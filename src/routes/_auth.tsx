import SpinnerPage from "@/components/general/SpinnerPage";
import Squares from "@/components/general/Squares";
import { Show, useAuth } from "@clerk/react";
import { createFileRoute, Link, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
    component: AuthLayout
});

function AuthLayout() {
    const { isLoaded, isSignedIn } = useAuth();
    console.log("🚀 ~ isSignedIn (AuthLayout):", isSignedIn);

    if (!isLoaded) return <SpinnerPage />;
    if (isSignedIn) return <Navigate to="/dashboard" replace />;

    return (
        <Show when="signed-out">
            <section className="relative min-h-svh">
                <div className="absolute inset-0">
                    <Squares direction="diagonal" speed={0.2} squareSize={30} />
                </div>
                <div className="pointer-events-none relative z-10 flex min-h-svh flex-col items-center justify-center gap-2 p-6 md:p-10">
                    <Link className="pointer-events-auto" to="/">
                        <h3 className="w-max px-4 text-2xl font-extrabold tracking-tight text-balance italic hover:not-italic">SJILY</h3>
                    </Link>
                    <div className="pointer-events-auto">
                        <Outlet />
                    </div>
                </div>
            </section>
        </Show>
    );
}
