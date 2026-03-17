import type { TimeZoneEntry } from "../types/schedule";

export const TIMEZONES_DISPLAY = [
    { label: "MX", zone: "America/Mexico_City" },
    { label: "ARG", zone: "America/Argentina/Buenos_Aires" },
    { label: "CL", zone: "America/Santiago" },
    { label: "ES", zone: "Europe/Madrid" },
]

export const TIMEZONE_OPTIONS = [
    { label: "México", zone: "America/Mexico_City" },
    { label: "Argentina", zone: "America/Argentina/Buenos_Aires" },
    { label: "Chile", zone: "America/Santiago" },
    { label: "España", zone: "Europe/Madrid" },
    { label: "Colombia ", zone: "America/Bogota" },
    { label: "Perú", zone: "America/Lima" },
    { label: "Venezuela", zone: "America/Caracas" },
    { label: "USA Este", zone: "America/New_York" },
    { label: "USA Oeste", zone: "America/Los_Angeles" },
]

export function convertToTimezones(time: string, fromZone: string): TimeZoneEntry[] {
    if (!time) return []

    const [hours, minutes] = time.split(":").map(Number)

    const date = new Date()
    const originTime = new Date(date.toLocaleString("en-US", { timeZone: fromZone }))
    originTime.setHours(hours, minutes, 0, 0)

    const utcOffset = date.getTime() - new Date(date.toLocaleString("en-US", { timeZone: fromZone })).getTime()
    const utcDate = new Date(originTime.getTime() + utcOffset)

    const allZones = [
        { label: TIMEZONE_OPTIONS.find(tz => tz.zone === fromZone)?.label ?? "LOCAL", zone: fromZone },
        ...TIMEZONES_DISPLAY.filter(tz => tz.zone !== fromZone)  // evita duplicado
    ]

    return allZones.map(tz => ({
        label: tz.label,
        time: utcDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: tz.zone
        })
    }))
}