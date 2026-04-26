import { useLocation } from "@tanstack/react-router";

export function useBreadcrumbs() {
    const pathname = useLocation({ select: (location) => location.pathname });
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "dashboard", path: "/dashboard" }];

    let accumulatedPath = "";
    segments.forEach((segment) => {
        if (segment === "dashboard") return;
        accumulatedPath += `/${segment}`;
        breadcrumbs.push({ name: segment, path: accumulatedPath });
    });

    const elements = breadcrumbs.slice(0, -1);
    const active = breadcrumbs[breadcrumbs.length - 1];

    return { elements, active };
}
