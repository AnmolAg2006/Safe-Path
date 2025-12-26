export type RiskCluster = {
  startIndex: number
  endIndex: number
  count: number
  severity: "HIGH" | "MEDIUM"
}

export function clusterRiskSegments(
  segments: { level: string }[],
  eps = 2 // max gap between risky segments
): RiskCluster[] {
  const riskyIndexes = segments
    .map((s, i) => (s.level !== "SAFE" ? i : -1))
    .filter(i => i !== -1)

  if (riskyIndexes.length === 0) return []

  const clusters: RiskCluster[] = []
  let start = riskyIndexes[0]
  let prev = riskyIndexes[0]

  for (let i = 1; i < riskyIndexes.length; i++) {
    const curr = riskyIndexes[i]

    if (curr - prev <= eps) {
      prev = curr
    } else {
      clusters.push({
        startIndex: start,
        endIndex: prev,
        count: prev - start + 1,
        severity: prev - start + 1 >= 4 ? "HIGH" : "MEDIUM",
      })
      start = curr
      prev = curr
    }
  }

  clusters.push({
    startIndex: start,
    endIndex: prev,
    count: prev - start + 1,
    severity: prev - start + 1 >= 4 ? "HIGH" : "MEDIUM",
  })

  return clusters
}
