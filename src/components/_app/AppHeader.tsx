import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/useBreadCrumbs";

function AppHeader() {
    const { t } = useTranslation();
    const { elements, active } = useBreadcrumbs();

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b ps-3 pe-2">
            <SidebarTrigger className="md:hidden" />
            <div className="me-2 h-4 md:hidden">
                <Separator orientation="vertical" className="h-full" />
            </div>
            <Breadcrumb className="me-auto">
                <BreadcrumbList className="scrollbar-hide max-w-2xs flex-nowrap overflow-auto">
                    {elements.map((el) => (
                        <Fragment key={el.name}>
                            <BreadcrumbItem>
                                <Link to={el.path}>{t(el.name)}</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                        </Fragment>
                    ))}
                    <BreadcrumbItem>
                        <BreadcrumbPage>{t(active.name)}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UserButton />
        </header>
    );
}

export default AppHeader;
