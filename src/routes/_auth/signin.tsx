import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/signin")({
    component: SignIn
});

function SignIn() {
    return <ClerkSignIn />;
}
