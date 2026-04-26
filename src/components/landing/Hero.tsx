import Autoplay from "embla-carousel-autoplay";
import { LogIn, Mail } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Squares from "@/components/general/Squares";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const SLIDES = [{ key: "dashboard" }, { key: "attendance" }, { key: "participants" }, { key: "workshops" }, { key: "feedback" }, { key: "events" }, { key: "badges" }, { key: "analytics" }] as const;

function Hero() {
    const { t } = useTranslation();
    const [api, setApi] = useState<CarouselApi>();
    const [activeIndex, setActiveIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!api) return;
        setActiveIndex(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;
        api.on("reInit", onSelect);
        api.on("select", onSelect);
        return () => {
            api.off("reInit", onSelect);
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    return (
        <section aria-label="Hero" className="layout-container overflow-hidden">
            <div className="relative h-[350px] border-x">
                <Squares direction="diagonal" speed={0.2} squareSize={30} />
                <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
                    <h1 className="text-center text-4xl leading-tight font-extrabold text-balance md:text-5xl lg:text-6xl">{t("hero-title")}</h1>
                    <p className="text-muted-foreground mb-6 max-w-lg text-center text-xl">{t("hero-description")}</p>
                    <div className="pointer-events-auto flex w-full max-w-xl gap-2">
                        <Button className="flex-1" asChild>
                            <Link to="/signin">
                                <LogIn className="rtl:rotate-180" /> {t("sign-in")}
                            </Link>
                        </Button>
                        <Button variant="outline" className="flex-1" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
                            <Mail /> {t("contact")}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="relative w-full border-x bg-[linear-gradient(to_bottom,#1447e6,#193cb8)] p-6 md:p-12">
                <Carousel dir="ltr" setApi={setApi} opts={{ loop: true }} plugins={[Autoplay({ delay: 4000 })]}>
                    <CarouselContent>
                        {SLIDES.map(({ key }) => (
                            <CarouselItem key={key}>
                                <img src="https://ui.shadcn.com/placeholder.svg" alt={t(`hero-slide-${key}`)} className="aspect-video w-full rounded-md object-cover" />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>

            <div dir="ltr" className="flex items-center justify-center gap-2 border-x p-3">
                {SLIDES.map(({ key }, index) => (
                    <button key={key} type="button" onClick={() => api?.scrollTo(index)} className={cn("hidden cursor-pointer overflow-hidden rounded-sm border-2 md:block", activeIndex === index ? "border-primary" : "border-transparent opacity-60")}>
                        <img src="https://ui.shadcn.com/placeholder.svg" alt={t(`hero-slide-${key}`)} className="h-14 w-24 object-cover" />
                    </button>
                ))}
                {SLIDES.map(({ key }, index) => (
                    <button key={key} type="button" onClick={() => api?.scrollTo(index)} className={cn("size-2.5 cursor-pointer rounded-full md:hidden", activeIndex === index ? "bg-primary" : "bg-border")} aria-label={t(`hero-slide-${key}`)} />
                ))}
            </div>
        </section>
    );
}

export default Hero;
