"use client"

import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import MapSection from "./MapSection"
import FitBounds from "./FitBounds"
import { RouteSegment } from "@/lib/routeSegments"
import type { RiskCluster } from "@/lib/riskClustering"

type Props = {
  segments: RouteSegment[]
  highlightedIndex: number | null
  focusPoint: [number, number] | null
  riskClusters: RiskCluster[]   
  manualFocus: boolean

}

export default function MapClient({
  segments,
  highlightedIndex,
  focusPoint,
  riskClusters,
  manualFocus
}: Props) {
  const points = segments.flatMap((s) => s.points)

  return (
    <MapContainer
      center={[22.5, 78.9]}
      zoom={5}
      className="h-[630px] w-full rounded-xl"
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapSection
        segments={segments}
        highlightedIndex={highlightedIndex}
        focusPoint={focusPoint}
        riskClusters={riskClusters}   // ✅ PASS THROUGH
      />
{!manualFocus && !focusPoint && <FitBounds points={points} />}

    </MapContainer>
  )
}
