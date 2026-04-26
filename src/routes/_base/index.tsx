import { Fragment } from "react/jsx-runtime";

import Contact from "@/components/landing/Contact";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Integrations from "@/components/landing/Integrations";
import Process from "@/components/landing/Process";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_base/")({
    component: Index
});

function Index() {
    return (
        <Fragment>
            <Header />
            <Hero />
            <Features />
            <Integrations />
            <Process />
            <Contact />
            <Footer />
        </Fragment>
    );
}
