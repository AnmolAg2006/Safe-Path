import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"

type Props = {
  segments: RouteSegment[]
  highlightedIndex: number | null
  focusPoint: [number, number] | null
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
}: Props) {
  return (
    <MapClient
      segments={segments}
      highlightedIndex={highlightedIndex}
      focusPoint={focusPoint}
    />
  )
}
