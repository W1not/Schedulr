import type { Schedule, ScheduleEvent, Day } from "../types/schedule"

interface Props {
    schedule: Schedule
    setSchedule: React.Dispatch<React.SetStateAction<Schedule>>
}

export default function ScheduleForm({ schedule, setSchedule }: Props) {
    
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

    return (
        <div className="p-5 bg-cyan-950 overflow-y-auto">

            <h2 className="text-2xl font-bold mb-4">
                Schedule Editor
            </h2>
            <select
            value={schedule.template}
            onChange={(e) => setSchedule(prev => ({
                ...prev,
                template: e.target.value as any
            }))}
            >
                <option value="default">Default</option>
                <option value="hololive">Hololive</option>
            </select>

            {/* TITLE */}
            <div className="mb-4">
                <label className="block text-sm font-semibold">
                    Title
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
                <label className="block text-sm font-semibold">
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
            {/* EVENTS */}
            <div className="space-y-4">

                {schedule.events.map(event => (

                    <div
                        key={event.id}
                        className="border p-4 rounded bg-white shadow"
                    >

                        {/* DAY */}
                        <select
                            className="border p-2 rounded mb-2"
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

                        <button
                            className="text-red-500 text-sm"
                            onClick={() => removeEvent(event.id)}
                        >
                            Remove
                        </button>

                    </div>

                ))}

            </div>

            <button
                onClick={addEvent}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Add Event
            </button>

        </div>
    )
}