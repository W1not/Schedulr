import { useState } from "react"
import type { Schedule } from "../types/schedule"
import SchedulePreview from "../components/SchedulePreview"
import ScheduleForm from "../components/ScheduleForm"

const initialData: Schedule = {
    title: "WEEKLY SCHEDULE",
    weekLabel: "Week of Mar 2",
    backgroundImage: "",
    template: "default",
    events: []
}

export default function ScheduleBuilder() {
    const [schedule, setSchedule] = useState<Schedule>(initialData)

    return (
        <div className="w-screen h-screen flex flex-row">
            <div className="w-500px h-full overflow-y-auto bg-[#083344]">
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