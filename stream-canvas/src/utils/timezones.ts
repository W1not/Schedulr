import type { TimeZoneEntry } from "../types/schedule";

export const TIMEZONES_DISPLAY  = [
    { label: "MX", zone: "America/Mexico_City" },
    { label: "ARG", zone: "America/Argentina/Buenos_Aires" },
    { label: "CL", zone: "America/Santiago" },
    { label: "ES", zone: "Europe/Madrid" },
]

export const TIMEZONE_OPTIONS = [
    { label: "México (GMT-6)",    zone: "America/Mexico_City" },
    { label: "Argentina (GMT-3)", zone: "America/Argentina/Buenos_Aires" },
    { label: "Chile (GMT-3/-4)",  zone: "America/Santiago" },
    { label: "España (GMT+1/+2)", zone: "Europe/Madrid" },
    { label: "Colombia (GMT-5)",  zone: "America/Bogota" },
    { label: "Perú (GMT-5)",      zone: "America/Lima" },
    { label: "Venezuela (GMT-4)", zone: "America/Caracas" },
    { label: "USA Este (GMT-5)",  zone: "America/New_York" },
    { label: "USA Oeste (GMT-8)", zone: "America/Los_Angeles" },
]

export function convertToTimezones(time: string, fromZone: string): TimeZoneEntry[] {
    if (!time) return []

    const [hours, minutes] = time.split(":").map(Number)

    const date = new Date()
    const originTime = new Date(date.toLocaleString("en-US", { timeZone: fromZone }))
    originTime.setHours(hours, minutes, 0, 0)

    const utcOffset = date.getTime() - new Date(date.toLocaleString("en-US", { timeZone: fromZone })).getTime()
    const utcDate = new Date(originTime.getTime() + utcOffset)

    return TIMEZONES_DISPLAY
        .filter(tz => tz.zone !== fromZone) 
        .map(tz => ({
            label: tz.label,
            time: utcDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: tz.zone
            })
        }))
}