"use client"

import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapSection from "./MapSection"
import FitBounds from "./FitBounds"
import { RouteSegment } from "@/lib/routeSegments"

export default function MapView({
  segments,
}: {
  segments: RouteSegment[]
}) {
  // flatten all points from segments
  const allPoints = segments.flatMap((s) => s.points)

  return (
    <MapContainer
      center={[22.5, 78.9]} // India center (fallback)
      zoom={5}
      className="h-[450px] w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapSection segments={segments} />
      <FitBounds points={allPoints} />
    </MapContainer>
  )
}
