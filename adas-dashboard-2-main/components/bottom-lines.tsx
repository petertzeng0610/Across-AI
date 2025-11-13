"use client"

import { useState } from "react"

export default function BottomLines() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const points = [
    { label: "Protection Layer", position: "160px" },
    { label: "Datalake", position: "38%" },
    { label: "Inference Layer", position: "50%" },
    { label: "Analysis Layer", position: "62%" },
    { label: "Presentation Layer", position: "calc(100% - 160px)" },
  ]

  return (
    <div className="absolute bottom-8 left-0 right-0 px-8">
      <div className="relative w-full h-1">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />

        {points.map((point, index) => (
          <div
            key={index}
            className="absolute top-1/2 -translate-y-1/2 pointer-events-auto"
            style={{ left: point.position, transform: `translate(-50%, -50%)` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative">
              <div className="absolute inset-0 w-5 h-5 -left-1 -top-1 rounded-full bg-white/20 blur-sm" />
              <div
                className="relative w-3 h-3 rounded-full bg-white"
                style={{
                  boxShadow: "0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.3)",
                }}
              />
            </div>

            <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/90 text-sm font-normal px-3 py-1 rounded-md transition-colors duration-300 hover:text-white">
              {point.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
