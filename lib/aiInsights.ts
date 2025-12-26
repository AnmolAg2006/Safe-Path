export type AIInsight = {
  type: "RISK" | "INFO" | "CONFIDENCE"
  message: string
}

import type { RiskCluster } from "./riskClustering"

type Input = {
  riskZones: number
  worstLevel: "SAFE" | "CAUTION" | "DANGER"
  weatherCount: number
  rain: boolean
  wind: number
  hour: number
  clusters: RiskCluster[]   // ✅ ADD THIS
}


export function generateAIInsights({
  riskZones,
  worstLevel,
  weatherCount,
  rain,
  wind,
  hour,
  clusters,
}: Input): AIInsight[] {
  const insights: AIInsight[] = []

  /* 1️⃣ Time-based risk */
  if (hour >= 19 || hour <= 5) {
    insights.push({
      type: "RISK",
      message:
        "Night-time travel can reduce visibility and increase accident risk.",
    })
  }

  /* 2️⃣ Rain-based risk */
  if (rain) {
    insights.push({
      type: "RISK",
      message:
        "Rainfall detected along the route, which may affect road grip and visibility.",
    })
  }

  /* 3️⃣ Wind-based risk */
  if (wind > 20) {
    insights.push({
      type: "RISK",
      message:
        "Strong winds may impact vehicle stability, especially on open roads.",
    })
  }

  /* 4️⃣ Risk density */
  if (riskZones >= 5) {
    insights.push({
      type: "RISK",
      message:
        "Multiple risk zones are closely spaced, increasing cumulative exposure.",
    })
  }
  if (clusters.length > 0) {
    const high = clusters.filter(c => c.severity === "HIGH").length
    const medium = clusters.filter(c => c.severity === "MEDIUM").length

    insights.push({
      type: "RISK",
      message: `${clusters.length} concentrated risk cluster${
        clusters.length > 1 ? "s" : ""
      } detected along the route.`,
    })

    if (high > 0) {
      insights.push({
        type: "RISK",
        message: `${high} high-density cluster${
          high > 1 ? "s indicate" : " indicates"
        } prolonged unsafe conditions.`,
      })
    }

    if (medium > 0 && high === 0) {
      insights.push({
        type: "RISK",
        message:
          "Several short risk clusters detected, requiring intermittent caution.",
      })
    }
  }

  /* 5️⃣ Confidence insight */
  if (weatherCount > 30) {
    insights.push({
      type: "CONFIDENCE",
      message:
        "High confidence in this analysis due to dense and recent weather data.",
    })
  } else {
    insights.push({
      type: "INFO",
      message:
        "Limited forecast data available; conditions may change unexpectedly.",
    })
  }

  /* 6️⃣ Overall assessment */
  if (worstLevel === "SAFE") {
    insights.push({
      type: "INFO",
      message:
        "Overall conditions are stable, and no major safety threats were identified.",
    })
  }

  return insights.slice(0, 5)

}
