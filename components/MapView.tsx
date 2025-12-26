import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"
import type { RiskCluster } from "@/lib/riskClustering"

type Props = {
  segments: RouteSegment[]
  highlightedIndex: number | null
  focusPoint: [number, number] | null
  riskClusters: RiskCluster[]
  manualFocus: boolean
}

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full rounded-xl bg-gray-200 animate-pulse" />
  ),
})

export default function MapView({
  segments,
  highlightedIndex,
  focusPoint,
  riskClusters,
  manualFocus
}: Props) {
  return (
    <MapClient
      segments={segments}
      highlightedIndex={highlightedIndex}
      focusPoint={focusPoint}
      riskClusters={riskClusters}   // ✅ FIXED
      manualFocus={manualFocus}
    />
  )
}
