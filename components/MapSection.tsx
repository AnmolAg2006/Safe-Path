"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { RouteSegment } from "@/lib/routeSegments"
import type { RiskCluster } from "@/lib/riskClustering"

const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
)

type Props = {
  segments: RouteSegment[]
  highlightedIndex: number | null
  focusPoint: [number, number] | null
  riskClusters: RiskCluster[]   // ✅ ADD
}

export default function MapSection({
  segments,
  highlightedIndex,
  focusPoint,
  riskClusters,
}: Props) {
  const map = useMap()

  useEffect(() => {
    if (focusPoint) {
      map.flyTo(focusPoint, 11, { duration: 0.8 })
    }
  }, [focusPoint, map])

  const colorMap = {
    SAFE: "blue",
    CAUTION: "orange",
    DANGER: "red",
  }

  return (
    <>
      {/* BASE ROUTE SEGMENTS (existing logic untouched) */}
      {segments.map((seg, idx) => (
        <Polyline
          key={`seg-${idx}`}
          positions={seg.points}
          pathOptions={{
            color: colorMap[seg.level],
            weight: idx === highlightedIndex ? 8 : 4,
            opacity: idx === highlightedIndex ? 1 : 0.6,
          }}
          eventHandlers={{
            mouseover: (e) => {
              const popup = `
                <b>${seg.level}</b><br/>
                🌡 Temp: ${seg.weather.temp}°C<br/>
                💧 Humidity: ${seg.weather.humidity}%<br/>
                💨 Wind: ${seg.weather.wind} m/s<br/>
                ⏱ ETA: ${new Date(seg.arrivalTime).toLocaleTimeString()}
              `
              e.target.bindPopup(popup).openPopup()
            },
            mouseout: (e) => {
              e.target.closePopup()
            },
          }}
        />
      ))}

      {/* 🔴🟡 RISK CLUSTER OVERLAYS */}
      {riskClusters.map((cluster, idx) => {
        const clusterPoints = segments
          .slice(cluster.startIndex, cluster.endIndex + 1)
          .flatMap((s) => s.points)

        if (clusterPoints.length === 0) return null

        return (
          <Polyline
            key={`cluster-${idx}`}
            positions={clusterPoints}
            pathOptions={{
              color:
  cluster.severity === "HIGH" ? "#b91c1c" : "#d97706",

              weight: 14,        // wider than route
opacity: 0.18,     // much softer
 interactive: false, 

            }}
          />
        )
      })}
    </>
  )
}
