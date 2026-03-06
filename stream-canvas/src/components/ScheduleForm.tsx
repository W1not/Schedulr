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

            <div className="flex items-center gap-2 flex-wrap">

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
    const meta = templateRegistry[schedule.template] ?? templateRegistry["default"]
    const supports = (s: keyof TemplateSettings) => meta.supportedSettings.includes(s)
    const [bgOpen, setBgOpen] = useState(false)
    const [bgSettings, setSettingsOpen] = useState(false)

    const days: Day[] = [
        "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"
    ]

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

    const removeEvent = (id: string) => {
        setSchedule(prev => ({
            ...prev,
            events: prev.events.filter(event => event.id !== id)
        }))
    }

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
        <div className="p-5 overflow-y-auto min-w-600px max-w-600px">

            <h2 className="text-2xl font-bold mb-4">
                Schedule Editor
            </h2>

            <select
                value={schedule.template}
                onChange={(e) => setSchedule(prev => ({
                    ...prev,
                    template: e.target.value as any
                }))}
                className="
                        w-full px-4 py-2.5
                        bg-ink border border-slate
                        text-snow text-sm font-medium
                        rounded-xl cursor-pointer
                        appearance-none
                        focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan
                        transition-all duration-200
                        hover:border-cyan/50
                    "
            >
                <option value="default" className="bg-ink text-snow">Default</option>
                <option value="hololive" className="bg-ink text-snow">Hololive</option>
            </select>

            {/* TITLE */}
            <div className="mb-4">
                <label className="block text-2xl font-semibold text-gray-500">
                    TITLE
                </label>

                <input
                    className="w-full border p-2 rounded"
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
                    className="w-full border p-2 rounded"
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
                            className="w-full border p-2 rounded mb-2"
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