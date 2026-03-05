import type { Schedule } from "./schedule";

export interface TemplateMeta {
    id: string
    name: string
    description?: string

    width: number
    height: number

    supportsBackground: boolean
    supportsSecondaryText: boolean
    supportsIcons: boolean

    component: React.ComponentType<{
        schedule: Schedule
    }>
}