import { useState } from "react"
import type { Schedule } from "../types/schedule"
import SchedulePreview from "../components/SchedulePreview"
import ScheduleForm from "../components/ScheduleForm"

const initialData: Schedule = {
    title: "WEEKLY SCHEDULE",
    weekLabel: "",
    backgroundImage: "",
    template: "default",
    events: []
}

export default function ScheduleBuilder() {
    const [schedule, setSchedule] = useState<Schedule>(initialData)

    return (
        <div className="w-screen h-screen flex flex-row">
            <div className="w-600px h-full overflow-y-auto text-amber-50 bg-[#0d1117]">
                <ScheduleForm
                    schedule={schedule}
                    setSchedule={setSchedule}
                />
            </div>

            <div className="flex-1 flex items-center justify-center bg-[#111827]">
                <SchedulePreview
                    schedule={schedule}
                />
            </div>


        </div>
    )
}