"use client"

import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"

const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
)

const Tooltip = dynamic(
  () => import("react-leaflet").then((m) => m.Tooltip),
  { ssr: false }
)

export default function MapSection({
  segments,
}: {
  segments: RouteSegment[]
}) {
  const colorMap = {
    SAFE: "#2563eb",     // blue
    CAUTION: "#f59e0b",  // amber
    DANGER: "#dc2626",   // red
  }

  return (
    <>
      {segments.map((seg, idx) => (
        <div key={idx}>
          {/* Visible route */}
          <Polyline
            positions={seg.points}
            pathOptions={{
              color: colorMap[seg.level],
              weight: 6,
              opacity: 0.9,
            }}
          />

          {/* Invisible hover layer */}
          <Polyline
  // key={idx}
  positions={seg.points}
  pathOptions={{
    color: colorMap[seg.level],
    weight: 8,        // ⬅ thicker
    opacity: 0.9,     // ⬅ stronger
  }}
>

            <Tooltip sticky>
    <div className="text-xs">
      <div><b>Risk:</b> {seg.level}</div>
      <div>🌡 {seg.weather.temp}°C</div>
      <div>💧 {seg.weather.humidity}%</div>
      <div>💨 {seg.weather.wind} m/s</div>
      <div>{seg.weather.condition}</div>
    </div>
  </Tooltip>
          </Polyline>
        </div>
      ))}
    </>
  )
}
