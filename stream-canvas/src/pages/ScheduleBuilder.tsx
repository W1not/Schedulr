import React, { useState, useRef } from "react"
import { motion } from "motion/react"
import type { Schedule } from "../types/schedule"
import SchedulePreview from "../components/SchedulePreview"
import ScheduleForm from "../components/ScheduleForm"
import { AnimatePresence } from "motion/react"
import { snapdom } from '@zumer/snapdom';

import "./ScheduleBuilder.css"

const initialData: Schedule = {
    title: "WEEKLY SCHEDULE",
    timezone: "America/Mexico_City",
    weekLabel: "",
    backgroundImage: "",
    backgroundX: 50,
    backgroundY: 50,
    backgroundScale: 100,
    backgroundRotation: 0,
    template: "default",
    events: [],
    templateSettings: {}
}

export default function ScheduleBuilder() {

    const previewRef = useRef<HTMLDivElement>(null)
    const scaleRef = useRef<HTMLDivElement>(null)

    const exportImage = async () => {
        if (!previewRef.current || !scaleRef.current) return

        const originalTransform = scaleRef.current.style.transform
        scaleRef.current.style.transition = "none"
        scaleRef.current.style.transform = "scale(1)"

        await new Promise(resolve => requestAnimationFrame(resolve))

        const result = await snapdom(previewRef.current, { scale: 3 })

        scaleRef.current.style.transform = originalTransform

        await result.download({ filename: "schedule.png" })
    }

    const [schedule, setSchedule] = useState<Schedule>(initialData)
    const [formBar, setformBar] = useState(false)

    const canvasRef = useRef<HTMLDivElement>(null)
    const isDragging = useRef(false)
    const startPos = useRef({ x: 0, y: 0 })
    const scrollPos = useRef({ x: 0, y: 0 })

    const [zoom, setZoom] = useState(1)

    const zoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3))
    const zoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.2))
    const zoomReset = () => setZoom(1)

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startPos.current = { x: e.clientX, y: e.clientY }
        scrollPos.current = {
            x: canvasRef.current!.scrollLeft,
            y: canvasRef.current!.scrollTop
        }
        canvasRef.current!.style.cursor = "grabbing"
    }

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return

        const dx = e.clientX - startPos.current.x
        const dy = e.clientY - startPos.current.y

        canvasRef.current!.scrollLeft = scrollPos.current.x - dx
        canvasRef.current!.scrollTop = scrollPos.current.y - dy
    }

    const onMouseUp = () => {
        isDragging.current = false
        canvasRef.current!.style.cursor = "grap"
    }

    const onWheel = (e: React.WheelEvent) => {
        if (!e.ctrlKey) return
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom(prev => Math.min(Math.max(prev + delta, 0.2), 3))
    }

    return (
        <div className="h-screen flex flex-row bg-[#111827]">
            <div className="flex flex-row h-screen">
                <AnimatePresence>
                    {formBar && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: 420 }}
                            exit={{ width: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="h-full overflow-y-auto text-amber-50 bg-[#0d1117]"
                            style={{ borderRight: "1px solid #2a3347" }}>
                            <div style={{ width: 400 }}>
                                <ScheduleForm
                                    schedule={schedule}
                                    setSchedule={setSchedule}
                                />
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
                {/* Botón toggle */}
                <motion.button
                    onClick={() => setformBar(!formBar)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="
                                self-center
                                w-6 h-16 rounded-r-xl
                                bg-slate hover:bg-cyan/20 text-9xl
                                border-y border-r border-slate hover:border-cyan/40 hover:text-cyan
                                transition-colors duration-200
                                flex items-center justify-center text-amber-50
                            "
                >
                    <motion.span
                        animate={{ rotate: formBar ? 0 : 180 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl leading-none mt-0.5"
                    >
                        ‹
                    </motion.span>
                </motion.button>
            </div>
            <div
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onWheel={onWheel}
                className="canvas-area flex-1 overflow-auto select-none"
                style={{
                    cursor: "grab",
                    backgroundImage: `radial-gradient(circle, #2a3347 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            >
                <div className="fixed bottom-6 right-6 flex items-center gap-2 z-50 text-amber-50">

                    <motion.button
                        onClick={zoomOut}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-xl bg-ink border border-slate text-snow hover:border-cyan/50 hover:text-cyan transition-all flex items-center justify-center text-lg"
                    >
                        −
                    </motion.button>
                    <button
                        onClick={zoomReset}
                        className="px-3 h-9 rounded-xl bg-ink border border-slate text-fog hover:text-cyan hover:border-cyan/50 transition-all text-xs font-mono"
                    >
                        {Math.round(zoom * 100)}%
                    </button>

                    <motion.button
                        onClick={zoomIn}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-9 h-9 rounded-xl bg-ink border border-slate text-snow hover:border-cyan/50 hover:text-cyan transition-all flex items-center justify-center text-lg"
                    >
                        +
                    </motion.button>
                    <motion.button
                        onClick={exportImage}
                        className="w-auto h-9 rounded-xl bg-ink border border-slate text-snow hover:border-cyan/50 hover:text-cyan transition-all flex items-center justify-center p-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        Export PNG
                    </motion.button>
                </div>
                <div className="min-w-600 min-h-400 flex items-center justify-center">
                    <div ref={scaleRef} style={{ transform: `scale(${zoom})`, transformOrigin: "center center", transition: "transform 0.15s ease" }}>
                        <SchedulePreview schedule={schedule} previewRef={previewRef} />
                    </div>
                </div>
            </div>


        </div>
    )
}