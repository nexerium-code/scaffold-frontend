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

    // If the last element in elements is 'workshops', change active name to 'enrollees'
    if (elements.length > 0 && elements[elements.length - 1].name === "workshops") {
        active.name = "enrollees";
    }

    // If the last element in elements is 'participants', change active name to 'staff'
    if (elements.length > 0 && elements[elements.length - 1].name === "participants") {
        active.name = "staff";
    }

    return { elements, active };
}
