"use client"

import { buildTextSummary, buildExportJson } from "@/lib/routeExport"
import type { RouteExplanation } from "@/lib/routeExplanation"
import { motion } from "framer-motion"
import { fadeUp } from "@/lib/motion"

type Props = {
  from: string
  to: string
  distanceKm: number | null
  riskZones: number | null
  explanation: RouteExplanation | null
}

export default function RouteExportActions({
  from,
  to,
  distanceKm,
  riskZones,
  explanation,
}: Props) {
  if (!explanation || distanceKm == null || riskZones == null) return null

  const copySummary = async () => {
    const text = buildTextSummary({
      from,
      to,
      distanceKm,
      explanation,
    })
    await navigator.clipboard.writeText(text)
    alert("Route summary copied")
  }
  const shareWhatsApp = () => {
  const text = buildTextSummary({
    from,
    to,
    distanceKm,
    explanation,
  })

  const url =
    "https://wa.me/?text=" + encodeURIComponent(text)

  window.open(url, "_blank")
}
  const exportJson = () => {
    const data = buildExportJson({
      from,
      to,
      distanceKm,
      riskZones,
      explanation,
    })

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    })
    

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "safepath-route.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.1 }}
  className="flex gap-2 mt-3"
>

      <button
        onClick={copySummary}
        className="flex-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      >
        📋 Copy Summary
      </button>

      <button
        onClick={exportJson}
        className="flex-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      >
        ⬇️ Export JSON
      </button>
      <button
  onClick={shareWhatsApp}
  className="flex-1 border rounded-md px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
>
  🟢 Share WhatsApp
</button>

     </motion.div>
  )
}
