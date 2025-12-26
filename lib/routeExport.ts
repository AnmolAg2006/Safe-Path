import type { RouteExplanation } from "./routeExplanation"

export function buildTextSummary({
  from,
  to,
  distanceKm,
  explanation,
}: {
  from: string
  to: string
  distanceKm: number
  explanation: RouteExplanation
}) {
  return `
SafePath Route Summary

From: ${from}
To: ${to}
Distance: ${distanceKm.toFixed(1)} km

Safety Level: ${explanation.level.toUpperCase()}
Safety Score: ${explanation.score}/100

Summary:
${explanation.summary}

Key Factors:
${explanation.bullets.map(b => `- ${b}`).join("\n")}
`.trim()
}

export function buildExportJson({
  from,
  to,
  distanceKm,
  riskZones,
  explanation,
}: {
  from: string
  to: string
  distanceKm: number
  riskZones: number
  explanation: RouteExplanation
}) {
  return {
    from,
    to,
    distanceKm,
    riskZones,
    safety: {
      level: explanation.level,
      score: explanation.score,
      summary: explanation.summary,
      factors: explanation.bullets,
    },
    generatedAt: new Date().toISOString(),
  }
}
