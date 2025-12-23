"use client"

import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"

// dynamically import ONLY on client
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
)

export default function MapSection({
  segments,
}: {
  segments: RouteSegment[]
}) {
  const colorMap = {
    SAFE: "blue",
    CAUTION: "orange",
    DANGER: "red",
  }

  return (
    <>
      {segments.map((seg, idx) => (
        <Polyline
          key={idx}
          positions={seg.points}
          pathOptions={{
            color: colorMap[seg.level],
            weight: 5,
          }}
        />
      ))}
    </>
  )
}
