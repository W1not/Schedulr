import type { Schedule } from "../types/schedule"
import { templateRegistry } from "../templates/templateRegistry"

interface Props {
    schedule: Schedule
    previewRef: React.RefObject<HTMLDivElement | null>
}

export default function SchedulePreview({ schedule, previewRef }: Props) {

    const meta = templateRegistry[schedule.template] ?? templateRegistry["default"]
    const Template = meta.component

    return (
        <div className="w-1/2 flex justify-center items-center flex-col p-8"
            style={{ backgroundColor: "#111827" }}>

            <div ref={previewRef}>
                <Template schedule={schedule} />
            </div>
        </div>

    )
}