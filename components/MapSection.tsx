"use client"

import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"
const Polyline = dynamic(
  () => import("react-leaflet").then(m => m.Polyline),
  { ssr: false }
)

export default function MapSection({ segments }: { segments: RouteSegment[] }) {
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
            weight: 8,         
            opacity: 0.9,
          }}
          eventHandlers={{
            mouseover: (e) => {
              const popup = `
                <b>${seg.level}</b><br/>
                🌡 Temp: ${seg.weather.temp}°C<br/>
                💧 Humidity: ${seg.weather.humidity}%<br/>
                💨 Wind: ${seg.weather.wind} m/s<br/>
                ⏱ ${new Date(seg.arrivalTime).toLocaleTimeString()}

              `
              e.target.bindPopup(popup).openPopup()
            },
          }}
        />
      ))}
    </>
  )
}
