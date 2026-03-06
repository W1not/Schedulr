import DefaultTemplate from "./DefaultTemplate"
import HololiveTemplate from "./HoloTemplate"
import type { TemplateMeta } from "../types/template"

export const templateRegistry: Record<string, TemplateMeta> = {
  default: {
    id: "default",
    name: "Default",
    width: 900,
    height: 900,
    supportsBackground: true,
    supportsSecondaryText: true,
    supportsIcons: false,
    component: DefaultTemplate,
    supportedSettings: ["backgroundColor"]
  },
  hololive: {
    id: "hololive",
    name: "Hololive",
    width: 1920,
    height: 1080,
    supportsBackground: true,
    supportsSecondaryText: false,
    supportsIcons: true,
    component: HololiveTemplate,
    supportedSettings: ["backgroundColor", "headerColor"]
  },
}