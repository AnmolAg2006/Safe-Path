export type RouteExplanation = {
  level: "safe" | "moderate" | "risky"
  score: number
  summary: string
  bullets: string[]
}

export function getRouteExplanation({
  riskZones,
  worstLevel,
  wind,
  rain,
  temp,
  hour
}: {
  riskZones: number
  worstLevel: "low" | "medium" | "high"
  wind: number
  rain: boolean
  temp: number
  hour: number
}): RouteExplanation {

  let score = 100
  const bullets: string[] = []

  if (worstLevel === "high") {
    score -= 40
    bullets.push("Route passes through a high-risk area")
  } else if (riskZones >= 3) {
    score -= 25
    bullets.push(`Passes through ${riskZones} medium-risk zones`)
  } else if (riskZones > 0) {
    score -= 15
    bullets.push(`Passes through ${riskZones} medium-risk zone${riskZones > 1 ? "s" : ""}`)
  } else {
    bullets.push("Route avoids all known risk zones")
  }

  if (wind >= 30) {
    score -= 25
    bullets.push(`Very strong wind (${wind} km/h)`)
  } else if (wind >= 20) {
    score -= 15
    bullets.push(`Strong wind (${wind} km/h)`)
  }

  if (rain) {
    score -= 20
    bullets.push("Rainfall expected on this route")
  }

  if (temp <= 5 || temp >= 42) {
    score -= 10
    bullets.push(`Extreme temperature (${temp}°C)`)
  }

  if (hour >= 22 || hour <= 5) {
    score -= 15
    bullets.push("Night-time travel increases safety risk")
  } else if (hour >= 20) {
    score -= 8
    bullets.push("Late evening travel")
  }

  score = Math.max(0, Math.min(100, score))

  const level =
    score >= 75 ? "safe" :
    score >= 45 ? "moderate" : "risky"

  const summary =
    level === "safe"
      ? "This route is generally safe under current conditions."
      : level === "moderate"
      ? "This route has some safety concerns that should be considered."
      : "This route has multiple risk factors and may be unsafe."

  return { level, score, summary, bullets }
}
