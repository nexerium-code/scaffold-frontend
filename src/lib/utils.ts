import { ClassValue, clsx } from "clsx";
import { endOfDay, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function calendarSelect(current: { from?: Date; to?: Date } | undefined, newRange?: { from?: Date; to?: Date }): { from?: Date; to?: Date } {
    if (!newRange || (!newRange.from && !newRange.to)) {
        return { from: undefined, to: undefined };
    }

    // Convert selected dates to UTC to ensure consistent comparisons/storage
    const convertedRange = {
        from: newRange.from,
        to: newRange.to
    };

    // If the converted selection matches the current selection, clear the range (toggle behavior)
    if (current?.from && current?.to && convertedRange.from && convertedRange.to && current.from.getTime() === convertedRange.from.getTime() && current.to.getTime() === convertedRange.to.getTime()) {
        return { from: undefined, to: undefined };
    }

    return convertedRange;
}

export function calculatePercentage(capacity: number | undefined, value: number | undefined): number {
    if (!capacity || !value) return 0;
    if (capacity <= 0) return 0;
    const computed = (value / capacity) * 100;
    const clamped = Math.min(computed, 100);
    return Math.floor(clamped * 10) / 10;
}

export function toUTC(date: Date | undefined) {
    if (!date) return undefined;
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export function toYMD(date: Date | undefined) {
    if (!date) return undefined;
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

export function hasStarted(dates: (Date | undefined)[], mode: "Any" | "All") {
    // If no dates or any date is undefined, we cannot reliably determine the start.
    if (dates.length === 0 || dates.some((date) => date === undefined)) return true;

    const now = toZonedTime(new Date(), "Asia/Riyadh");
    if (mode === "Any") return dates.some((date) => startOfDay(toZonedTime(new Date(date!), "Asia/Riyadh")).getTime() <= now.getTime());
    if (mode === "All") return dates.every((date) => startOfDay(toZonedTime(new Date(date!), "Asia/Riyadh")).getTime() <= now.getTime());
    return false;
}

export function hasEnded(dates: (Date | undefined)[], mode: "Any" | "All") {
    // If no dates or any date is undefined, we cannot reliably determine the end.
    if (dates.length === 0 || dates.some((date) => date === undefined)) return true;

    const now = toZonedTime(new Date(), "Asia/Riyadh");
    if (mode === "Any") return dates.some((date) => endOfDay(toZonedTime(new Date(date!), "Asia/Riyadh")).getTime() <= now.getTime());
    if (mode === "All") return dates.every((date) => endOfDay(toZonedTime(new Date(date!), "Asia/Riyadh")).getTime() <= now.getTime());
    return false;
}

export function isBetween(firstDate: Date | undefined, secondDate: Date | undefined) {
    if (!firstDate || !secondDate) return false;

    const now = toZonedTime(new Date(), "Asia/Riyadh").getTime();
    const start = startOfDay(toZonedTime(new Date(firstDate), "Asia/Riyadh")).getTime();
    const end = endOfDay(toZonedTime(new Date(secondDate), "Asia/Riyadh")).getTime();
    return now >= start && now <= end;
}

// Helper functions for cleaner code organization
export function createLookupMap<T>(items: T[], keyField: keyof T, valueField: keyof T): Map<string, string> {
    const map = new Map<string, string>();
    items.forEach((item) => {
        const key = item[keyField] as string;
        const value = item[valueField] as string;
        map.set(key, value);
    });
    return map;
}
