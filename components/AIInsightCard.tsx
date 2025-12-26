"use client"

import { motion } from "framer-motion"
import { AIInsight } from "@/lib/aiInsights"
import { RiskCluster } from "@/lib/riskClustering"
import { RouteSegment } from "@/lib/routeSegments"
import { getClusterCenter } from "@/lib/clusterUtils"

type Props = {
  insights: AIInsight[]
  clusters: RiskCluster[]
  segments: RouteSegment[]
  onFocusCluster: (point: [number, number]) => void
}

export default function AIInsightCard({
  insights,
  clusters,
  segments,
  onFocusCluster,
}: Props) {
  if (insights.length === 0) return null

  function handleInsightClick(message: string) {
    if (!message.toLowerCase().includes("cluster")) return
    if (clusters.length === 0) return

    // Prefer HIGH severity cluster, fallback to first
    const target =
      clusters.find((c) => c.severity === "HIGH") ?? clusters[0]

    const point = getClusterCenter(target, segments)
    onFocusCluster(point)
    
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border bg-white p-4 shadow"
    >
      <div className="font-semibold mb-2 flex items-center gap-2">
        🧠 Safety Insights
      </div>

      <ul className="space-y-2 text-sm">
        {insights.map((i, idx) => {
          const isClusterInsight =
            i.type === "RISK" &&
            i.message.toLowerCase().includes("cluster")

          return (
            <li
              key={idx}
              onClick={() => handleInsightClick(i.message)}
              className={`flex gap-2 ${
                isClusterInsight
                  ? "cursor-pointer hover:underline hover:text-red-600"
                  : ""
              }`}
            >
              <span>
                {i.type === "RISK"
                  ? "⚠️"
                  : i.type === "CONFIDENCE"
                  ? "✅"
                  : "ℹ️"}
              </span>
              <span>{i.message}</span>
            </li>
          )
        })}
      </ul>
    </motion.div>
  )
}
