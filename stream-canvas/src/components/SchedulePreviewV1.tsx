import type { Schedule } from "../types/schedule"
import { useRef } from "react"
import html2canvas from "html2canvas"

interface Props {
    schedule: Schedule
}

export default function SchedulePreview({ schedule }: Props) {

    const previewRef = useRef<HTMLDivElement>(null)
    

    const exportImage = async () => {
        if (!previewRef.current) return

        const canvas = await html2canvas(previewRef.current, {
            scale: 3,
            useCORS: true,
            backgroundColor: null,
            logging: false
        })

        const image = canvas.toDataURL("image/png")

        const link = document.createElement("a")
        link.href = image
        link.download = "schedule.png"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="w-1/2 flex justify-center items-center flex-col p-8"
            style={{ backgroundColor: "#111827" }}>

            <div
                ref={previewRef}
                className="relative w-900px h-900px rounded-xl overflow-hidden shadow-xl"
                style={{
                    backgroundImage: schedule.backgroundImage
                        ? `url(${schedule.backgroundImage})`
                        : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >

                {/* overlay */}
                <div className="absolute inset-0  backdrop-blur-sm"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }} />

                {/* content */}
                <div className="relative p-8">

                    {/* title */}
                    <h1 className="text-5xl font-bold text-center">
                        {schedule.title}
                    </h1>

                    <p className="text-center mb-10"
                        style={{ color: "#d1d5db" }}>
                        {schedule.weekLabel}
                    </p>

                    {/* events */}
                    <div className="space-y-4">

                        {schedule.events.map(event => (

                            <div
                                key={event.id}
                                className="flex items-center justify-between backdrop-blur-md p-4 rounded-lg"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.1)"
                                }}
                            >

                                <div className="font-bold text-lg w-20">
                                    {event.day}
                                </div>

                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {event.mainText || "Event title"}
                                    </p>

                                    <p className="text-sm"
                                        style={{ background: "#fffff" }}>
                                        {event.secondaryText}
                                    </p>
                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

            <button
                onClick={exportImage}
                className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
            >
                Export PNG
            </button>
        </div>

    )
}