import type { Schedule } from "../types/schedule"
import { useRef } from "react"
import { templateRegistry } from "../templates/templateRegistry"
import { snapdom } from '@zumer/snapdom';
import { motion } from "motion/react";


interface Props {
    schedule: Schedule
}

export default function SchedulePreview({ schedule }: Props) {

    const previewRef = useRef<HTMLDivElement>(null)

    const Template = templateRegistry[schedule.template]

    const exportImage = async () => {

        if (!previewRef.current) return 

        const result = await snapdom(previewRef.current, {
            scale: 2
        })

        await result.download({
            filename: "schedule.png"
        })

    }

    return (
        <div className="w-1/2 flex justify-center items-center flex-col p-8"
            style={{ backgroundColor: "#111827" }}>

            <div ref={previewRef}>
                <Template schedule={schedule} />
            </div>

            <motion.button
                onClick={exportImage}
                className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded z-50"
                whileHover={{scale:1.05}}
                whileTap={{scale:0.9}}
            >
                Export PNG
            </motion.button>
        </div>

    )
}