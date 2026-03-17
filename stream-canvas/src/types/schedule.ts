export type Day =
    | "MON"
    | "TUE"
    | "WED"
    | "THU"
    | "FRI"
    | "SAT"
    | "SUN"

export interface TimeZoneEntry {
    label: string
    time: string
}

export interface ScheduleEvent {
    id: string
    day: Day
    mainText: string
    secondaryText?: string
    startTime: string
    times?: TimeZoneEntry[]
    active: boolean
}

export interface TemplateSettings {
    backgroundColor?: string
    headerColor?: string
    textColor?: string
    panelColor?: string
}

export type TemplateType =
    | "default"
    | "hololive"

export interface Schedule {
    timezone: string
    title: string
    weekLabel: string
    backgroundImage?: string
    backgroundX: number
    backgroundY: number
    backgroundScale: number
    backgroundRotation: number
    template: TemplateType
    events: ScheduleEvent[]
    templateSettings: TemplateSettings 
}

