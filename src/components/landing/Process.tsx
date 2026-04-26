import { CalendarPlus, ChartLine, Globe, LayoutDashboard, LucideIcon, Paintbrush, Plug } from "lucide-react";
import { useTranslation } from "react-i18next";

import Squares from "@/components/general/Squares";
import { cn } from "@/lib/utils";

const STEPS = [
    { key: "1", icon: CalendarPlus },
    { key: "2", icon: Paintbrush },
    { key: "3", icon: Globe },
    { key: "4", icon: Plug },
    { key: "5", icon: LayoutDashboard },
    { key: "6", icon: ChartLine }
] as const;

function Process() {
    const { t } = useTranslation();

    return (
        <section aria-label="Process" className="layout-container overflow-hidden">
            <div className="relative h-70 border-x border-b">
                <Squares direction="diagonal" speed={0.2} squareSize={30} />
                <div className="pointer-events-none absolute inset-0 z-10 p-12">
                    <p className="text-muted-foreground text-sm font-semibold tracking-tight text-balance uppercase">{t("process-subtitle")}</p>
                    <h2 className="mt-2 text-4xl leading-tight font-extrabold text-balance md:text-5xl lg:text-6xl">{t("process-title")}</h2>
                    <p className="text-muted-foreground max-w-md text-xl">{t("process-description")}</p>
                </div>
            </div>

            <div className="relative border-x border-b py-12 md:py-16">
                <div className="absolute inset-s-[45px] top-0 bottom-0 w-0.5 md:inset-s-1/2 md:-translate-x-px" aria-hidden>
                    <div className="from-background via-border to-background h-full w-full bg-linear-to-b" />
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="via-primary h-1/3 w-full bg-linear-to-b from-transparent to-transparent opacity-50" style={{ animation: "timeline-shimmer 4s ease-in-out infinite" }} />
                    </div>
                </div>

                <div className="relative space-y-6 md:space-y-10">
                    {STEPS.map(({ key, icon: Icon }, index) => {
                        const isRight = index % 2 !== 0;
                        return (
                            <div key={key} className="grid grid-cols-[58px_1fr] items-center gap-2 px-4 md:grid-cols-[1fr_60px_1fr] md:gap-6 md:px-8">
                                <div className="flex justify-center md:col-start-2 md:row-start-1">
                                    <div className="timeline-node bg-primary text-primary-foreground border-background relative z-10 flex size-11 items-center justify-center rounded-full border-4 text-sm font-bold" style={{ animationDelay: `${index * 0.6}s` }}>
                                        {index + 1}
                                    </div>
                                </div>

                                <div className={cn("md:row-start-1", isRight ? "md:col-start-3" : "md:col-start-1")}>
                                    <TimelineCard icon={Icon} title={t(`process-step-${key}-title`)} description={t(`process-step-${key}-description`)} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

type TimelineCardProps = {
    icon: LucideIcon;
    title: string;
    description: string;
};

function TimelineCard({ icon: Icon, title, description }: TimelineCardProps) {
    return (
        <div className="group relative rounded-xl border p-5 transition-all duration-300 bg-card/60 backdrop-blur-sm hover:border-primary/25 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
            <div className="bg-primary/10 text-primary group-hover:bg-primary/15 mb-3 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors">
                <Icon className="size-4.5" />
            </div>
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>
        </div>
    );
}

export default Process;
