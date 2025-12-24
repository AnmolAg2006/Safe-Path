"use client"

import dynamic from "next/dynamic"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { RouteSegment } from "@/lib/routeSegments"

const Polyline = dynamic(
  () => import("react-leaflet").then(m => m.Polyline),
  { ssr: false }
)

type Props = {
  segments: RouteSegment[]
  highlightedIndex: number | null
  focusPoint: [number, number] | null
}

export default function MapSection({
  segments,
  highlightedIndex,
  focusPoint,
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
      {segments.map((seg, idx) => (
        <Polyline
  key={idx}
  positions={seg.points}
  pathOptions={{
    color: colorMap[seg.level],
    weight: idx === highlightedIndex ? 8 : 4,
    opacity: idx === highlightedIndex ? 1 : 0.6,
  }}
  eventHandlers={{
    mousemove: (e) => {
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
    </>
  )
}
