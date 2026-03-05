import type { Schedule } from "../types/schedule"
import { useRef } from "react"
import html2canvas from "html2canvas"
import { templateRegistry } from "../templates/templateRegistry"


interface Props {
    schedule: Schedule
}

export default function SchedulePreview({ schedule }: Props) {

    const previewRef = useRef<HTMLDivElement>(null)

    const Template = templateRegistry[schedule.template]

    const exportImage = async () => {
        if (!previewRef.current) return

        const canvas = await html2canvas(previewRef.current, {
            scale: 3,
            useCORS: true,
            backgroundColor: null,
            allowTaint: true
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

            <div ref={previewRef}>
                <Template schedule={schedule} />
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