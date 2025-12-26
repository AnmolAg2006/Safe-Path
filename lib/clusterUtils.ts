import { RouteSegment } from "@/lib/routeSegments"
import { RiskCluster } from "@/lib/riskClustering"

export function getClusterCenter(
  cluster: RiskCluster,
  segments: RouteSegment[]
): [number, number] {
  const points = segments
    .slice(cluster.startIndex, cluster.endIndex + 1)
    .flatMap((s) => s.points)

  const mid = Math.floor(points.length / 2)
  return points[mid]
}