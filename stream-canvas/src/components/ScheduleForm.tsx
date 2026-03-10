import { useState } from "react";
import type { Schedule, ScheduleEvent, Day, TemplateSettings } from "../types/schedule"
import { AnimatePresence, motion } from "motion/react";
import { templateRegistry } from "../templates/templateRegistry"

interface Props {
    schedule: Schedule
    setSchedule: React.Dispatch<React.SetStateAction<Schedule>>
}

const PRESET_COLORS = [
    "#00d4ff", // cyan
    "#a78bfa", // lavender
    "#ff9f7f", // peach
    "#6ee7b7", // mint
    "#ff4d6d", // red
    "#ffd60a", // yellow
    "#ffffff", // white
    "#0d1117", // black
]

// Component to select a color, with some presets and an option for custom colors
function ColorPicker({
    label,
    value,
    onChange,
}: {
    label: string
    value?: string
    onChange: (color: string) => void
}) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-bold text-fog uppercase tracking-widest mb-2">
                {label}
                <span className="ml-2 font-mono text-cyan normal-case">{value ?? "default"}</span>
            </label>

            <div className="flex items-center gap-2 flex-wrap py-2">

                {/* Colores preestablecidos */}
                {PRESET_COLORS.map(color => (
                    <button
                        key={color}
                        type="button"
                        onClick={() => onChange(color)}
                        style={{ backgroundColor: color }}
                        className={`
                            w-7 h-7 rounded-full transition-all duration-150 cursor-pointer
                            hover:scale-110
                            ${value === color
                                ? "ring-2 ring-offset-2 ring-offset-ink ring-white scale-110"
                                : "ring-1 ring-slate"
                            }
                        `}
                    />
                ))}

                {/* Separador */}
                <div className="w-px h-6 bg-slate mx-1" />

                {/* Color custom */}
                <label
                    className="w-7 h-7 rounded-full cursor-pointer ring-1 ring-slate hover:scale-110 transition-all duration-150 overflow-hidden"
                    title="Color personalizado"
                    style={{ backgroundColor: value && !PRESET_COLORS.includes(value) ? value : "transparent" }}
                >
                    {(!value || PRESET_COLORS.includes(value)) && (
                        <span className="flex items-center justify-center w-full h-full text-fog text-xs">+</span>
                    )}
                    <input
                        type="color"
                        value={value ?? "#ffffff"}
                        onChange={(e) => onChange(e.target.value)}
                        className="opacity-0 w-0 h-0 absolute"
                    />
                </label>

                {/* Reset a default */}
                {value && (
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="text-xs text-fog hover:text-red-400 transition-colors ml-1"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    )
}

export default function ScheduleForm({ schedule, setSchedule }: Props) {
    // Obtain template metadata to know which settings are supported
    const meta = templateRegistry[schedule.template] ?? templateRegistry["default"]
    const supports = (s: keyof TemplateSettings) => meta.supportedSettings.includes(s)

    // State for toggling background settings and template settings visibility
    const [bgOpen, setBgOpen] = useState(false)

    // State for toggling template settings visibility
    const [bgSettings, setSettingsOpen] = useState(false)

    const [templateOpen, setTemplateOpen] = useState(false)

    // Days of the week for the dropdown
    const days: Day[] = [
        "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
    ]

    // Functions to manipulate events in the schedule
    // Add a new event with default values
    const addEvent = () => {
        const newEvent: ScheduleEvent = {
            id: crypto.randomUUID(),
            day: "MON",
            mainText: "",
            secondaryText: "",
            active: true
        }

        setSchedule(prev => ({
            ...prev,
            events: [...prev.events, newEvent]
        }))
    }

    // Update a specific field of an event by its ID
    // field is the key of ScheduleEvent that we want to update, value is the new value for that field
    const updateEvent = (
        id: string,
        field: keyof ScheduleEvent,
        value: string
    ) => {
        setSchedule(prev => ({
            ...prev,
            events: prev.events.map(event =>
                event.id === id
                    ? { ...event, [field]: value }
                    : event
            )
        }))
    }

    // Remove an event from the schedule by its ID
    const removeEvent = (id: string) => {
        setSchedule(prev => ({
            ...prev,
            events: prev.events.filter(event => event.id !== id)
        }))
    }

    // Reset background values to defaults
    const resetBackgroundValues = () => {
        setSchedule(prev => ({
            ...prev,
            backgroundX: 50,
            backgroundY: 50,
            backgroundScale: 100,
            backgroundRotation: 0
        }))
    }

    return (
        <div className="p-5 flex flex-col overflow-y-auto gap-2">

            <h2 className="text-5xl font-bold mb-4">
                Schedule Editor
            </h2>

            <hr className="border-slate mb-6" />

            <div className="bg-ink border border-slate rounded-2xl overflow-hidden">

                {/* Header */}
                <button
                    type="button"
                    onClick={() => setTemplateOpen(!templateOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-dusk transition-all duration-200"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-fog uppercase tracking-widest">Plantilla</span>
                        <span className="text-xs text-cyan font-medium">
                            {templateRegistry[schedule.template]?.name}
                        </span>
                    </div>
                    <motion.span
                        animate={{ rotate: templateOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-fog"
                    >
                        ▾
                    </motion.span>
                </button>

                <AnimatePresence>
                    {templateOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-3 pb-3 pt-1 grid grid-cols-2 gap-2 border-t border-slate">
                                {Object.values(templateRegistry).map(meta => (
                                    <button
                                        key={meta.id}
                                        type="button"
                                        onClick={() => {
                                            setSchedule(prev => ({ ...prev, template: meta.id as any }))
                                            setTemplateOpen(false)
                                        }}
                                        className={`
                                                    relative flex flex-col items-start gap-1.5
                                                    p-3 rounded-xl border cursor-pointer
                                                    transition-all duration-200 text-left
                                ${schedule.template === meta.id
                                                ? "border-cyan bg-cyan/10 ring-1 ring-cyan"
                                                : "border-slate bg-dusk hover:border-cyan/40 hover:bg-cyan/5"
                                            }
                            `}
                                    >
                                        <div className={`
                                w-full h-8 rounded-lg mb-1 flex items-center justify-center text-xs font-mono
                                ${schedule.template === meta.id ? "bg-cyan/20 text-cyan" : "bg-slate/50 text-fog"}
                            `}>
                                            {meta.width}×{meta.height}
                                        </div>

                                        <span className={`text-sm font-semibold ${schedule.template === meta.id ? "text-cyan" : "text-snow"}`}>
                                            {meta.name}
                                        </span>

                                        <div className="flex gap-1 flex-wrap">
                                            {meta.supportsBackground && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-lavender/20 text-lavender">BG</span>}
                                            {meta.supportsSecondaryText && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-mint/20 text-mint">2ND</span>}
                                            {meta.supportsIcons && <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-peach/20 text-peach">ICO</span>}
                                        </div>

                                        {schedule.template === meta.id && (
                                            <span className="absolute top-2 right-2 text-cyan text-xs">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TITLE */}
            <div className="mb-4">
                <label className="block text-2xl font-semibold text-gray-500">
                    TITLE
                </label>

                <input
                    className="w-full border p-2 rounded-2xl"
                    value={schedule.title}
                    onChange={(e) =>
                        setSchedule(prev => ({
                            ...prev,
                            title: e.target.value
                        }))
                    }
                />
            </div>

            {/* WEEK */}
            <div className="mb-6">
                <label className="block text-2xl font-semibold text-gray-500">
                    Week Label
                </label>

                <input
                    className="w-full border p-2 rounded-2xl"
                    value={schedule.weekLabel}
                    onChange={(e) =>
                        setSchedule(prev => ({
                            ...prev,
                            weekLabel: e.target.value
                        }))
                    }
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-semibold">
                    Background Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        const url = URL.createObjectURL(file)

                        setSchedule(prev => ({
                            ...prev,
                            backgroundImage: url
                        }))
                    }}
                />
            </div>
            {/* Background parameters */}
            <div>
                <button
                    type="button"
                    onClick={() => setBgOpen(!bgOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-dusk transition-all duration-200">
                    <span className="text-xs font-bold text-fog uppercase tracking-widest">
                        🖼️ Background parameters
                    </span>
                    <motion.span
                        animate={{ rotate: bgOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-fog"
                    >
                        ▾
                    </motion.span>
                </button>



                <AnimatePresence>
                    {bgOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-4 border-t border-slate pt-4">
                                <div>
                                    <label className="block text-xd font-bold text-fog uppercase tracking-widest mb-1.5">
                                        X
                                        <span className="ml-2 text-cyan font-mono">{schedule.backgroundX ?? 50}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={schedule.backgroundX ?? 50}
                                        onChange={(e) =>
                                            setSchedule(prev => ({
                                                ...prev,
                                                backgroundX: Number(e.target.value)
                                            }))
                                        }
                                        className="w-full accent-cyan"
                                    />
                                    <label className="block text-xd font-bold text-fog uppercase tracking-widest mb-1.5">
                                        Y
                                        <span className="ml-2 text-cyan font-mono">{schedule.backgroundY ?? 50}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        value={schedule.backgroundY ?? 50}
                                        onChange={(e) =>
                                            setSchedule(prev => ({
                                                ...prev,
                                                backgroundY: Number(e.target.value)
                                            }))
                                        }
                                        className="w-full accent-cyan"
                                    />
                                    <label className="block text-xd font-bold text-fog uppercase tracking-widest mb-1.5">
                                        Scale
                                        <span className="ml-2 text-cyan font-mono">{schedule.backgroundScale ?? 50}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={100}
                                        max={500}
                                        value={schedule.backgroundScale ?? 50}
                                        onChange={(e) =>
                                            setSchedule(prev => ({
                                                ...prev,
                                                backgroundScale: Number(e.target.value)
                                            }))
                                        }
                                        className="w-full accent-cyan"
                                    />
                                    <label className="block text-xd font-bold text-fog uppercase tracking-widest mb-1.5">
                                        Rotation
                                        <span className="ml-2 text-cyan font-mono">{schedule.backgroundRotation ?? 50}%</span>
                                    </label>
                                    <input
                                        type="range"
                                        min={-360}
                                        max={360}
                                        value={schedule.backgroundRotation ?? 1}
                                        onChange={(e) =>
                                            setSchedule(prev => ({
                                                ...prev,
                                                backgroundRotation: Number(e.target.value)
                                            }))
                                        }
                                        className="w-full accent-cyan"
                                    />

                                    <motion.button
                                        onClick={resetBackgroundValues}
                                        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        Reset Values
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Template Settings */}
            <div>
                <button
                    type="button"
                    onClick={() => setSettingsOpen(!bgSettings)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-dusk transition-all duration-200">
                    <span className="text-xs font-bold text-fog uppercase tracking-widest">
                        🖼️ Template Settings
                    </span>
                    <motion.span
                        animate={{ rotate: bgSettings ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-fog"
                    >
                        ▾
                    </motion.span>
                </button>



                <AnimatePresence>
                    {bgSettings && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 space-y-4 border-t border-slate pt-4">
                                <div>
                                    <label className="block text-xs font-bold text-fog uppercase tracking-widest">
                                        {supports("backgroundColor") && (
                                            <ColorPicker
                                                label="Fondo"
                                                value={schedule.templateSettings.backgroundColor}
                                                onChange={(val) => setSchedule(prev => ({
                                                    ...prev,
                                                    templateSettings: { ...prev.templateSettings, backgroundColor: val }
                                                }))}
                                            />
                                        )}

                                        {supports("headerColor") && (
                                            <ColorPicker
                                                label="Header"
                                                value={schedule.templateSettings.headerColor}
                                                onChange={(val) => setSchedule(prev => ({
                                                    ...prev,
                                                    templateSettings: { ...prev.templateSettings, headerColor: val }
                                                }))}
                                            />
                                        )}

                                        {supports("panelColor") && (
                                            <ColorPicker
                                                label="Panel"
                                                value={schedule.templateSettings.panelColor}
                                                onChange={(val) => setSchedule(prev => ({
                                                    ...prev,
                                                    templateSettings: { ...prev.templateSettings, panelColor: val }
                                                }))}
                                            />
                                        )}
                                    </label>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* EVENTS */}
            <div className="space-y-4 ">

                {schedule.events.map(event => (

                    <div
                        key={event.id}
                        className="border p-4 rounded  shadow"
                    >
                        <div className="flex flex-row gap-2">
                            <select
                                className="border p-2 w-full rounded mb-2 bg-blue-900"
                                value={event.day}
                                onChange={(e) =>
                                    updateEvent(event.id, "day", e.target.value)
                                }
                            >
                                {days.map(day => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>

                            <motion.button
                                className=" text-sm rounded-sm bg-red-600/40 text-red-400 p-2 w-full h-10"
                                onClick={() => removeEvent(event.id)}
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                X
                            </motion.button>
                        </div>
                        {/* DAY */}


                        {/* MAIN TEXT */}
                        <input
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Main text"
                            value={event.mainText}
                            onChange={(e) =>
                                updateEvent(event.id, "mainText", e.target.value)
                            }
                        />

                        {/* SECONDARY */}
                        <input
                            className="w-full border p-2 rounded-sm mb-2"
                            placeholder="Secondary text"
                            value={event.secondaryText}
                            onChange={(e) =>
                                updateEvent(event.id, "secondaryText", e.target.value)
                            }
                        />



                    </div>

                ))}

            </div>

            <motion.button
                onClick={addEvent}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
            >
                Add Event
            </motion.button>

        </div>
    )
}