import type { Schedule } from "../types/schedule"
import { useRef } from "react"
import html2canvas from "html2canvas"
import { templateRegistry } from "../templates/templateRegistry"
import { snapdom } from '@zumer/snapdom';


interface Props {
    schedule: Schedule
}

export default function SchedulePreview({ schedule }: Props) {

    const previewRef = useRef<HTMLDivElement>(null)

    const Template = templateRegistry[schedule.template]

    const exportImage = async () => {
        const el = document.querySelector('#previewRef');
        const result = await snapdom(el);

        const img = await result.toPng();
        document.body.appendChild(img);

        await result.download({ format: 'jpg', filename: 'my-capture.jpg' });
    }

    return (
        <div className="w-1/2 flex justify-center items-center flex-col p-8"
            style={{ backgroundColor: "#111827" }}>

            <div id={previewRef}>
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