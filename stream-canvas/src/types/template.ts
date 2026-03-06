import type { Schedule, TemplateSettings } from "./schedule";

export interface TemplateMeta {
    id: string
    name: string
    description?: string

    width: number
    height: number

    supportsBackground: boolean
    supportsSecondaryText: boolean
    supportsIcons: boolean
    supportedSettings: (keyof TemplateSettings)[]

    component: React.ComponentType<{
        schedule: Schedule
    }>
}