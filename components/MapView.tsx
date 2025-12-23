import dynamic from "next/dynamic"
import { RouteSegment } from "@/lib/routeSegments"

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[450px] w-full rounded-xl bg-gray-200 animate-pulse" />
  ),
})

export default function MapView({
  segments,
}: {
  segments: RouteSegment[]
}) {
  return <MapClient segments={segments} />
}
