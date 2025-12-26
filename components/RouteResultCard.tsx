"use client"

import type { RouteExplanation } from "@/lib/routeExplanation"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"

type Props = {
  explanation: RouteExplanation | null
  distanceKm: number | null
  riskZones: number | null
}

const styles = {
  safe: {
    badge: "bg-green-100 text-green-700",
    border: "border-green-300",
  },
  moderate: {
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-yellow-300",
  },
  risky: {
    badge: "bg-red-100 text-red-700",
    border: "border-red-300",
  },
}

export default function RouteResultCard({
  explanation,
  distanceKm,
  riskZones,
}: Props) {
  if (!explanation) return null

  const s = styles[explanation.level]

  return (
    <motion.div
  variants={fadeUp}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.25, ease: "easeOut" }}
  className={`border rounded-lg p-4 mb-3 bg-white ${s.border}`}
>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${s.badge}`}
        >
          {explanation.level} route
        </span>

        <span className="text-sm font-bold">
          {explanation.score}/100
        </span>
      </div>

      {/* Meta */}
      <div className="text-sm text-gray-600 flex gap-4 mb-2">
        {distanceKm !== null && (
          <span>📏 {distanceKm.toFixed(1)} km</span>
        )}
        {riskZones !== null && (
          <span>⚠️ {riskZones} risk zones</span>
        )}
      </div>

      {/* Summary */}
      <p className="text-sm font-medium mb-2">
        {explanation.summary}
      </p>

      {/* Bullets */}
      <ul className="text-sm list-disc ml-5 space-y-1">
        {explanation.bullets.slice(0, 3).map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </motion.div>

  )
}
