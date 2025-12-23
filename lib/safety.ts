import { WeatherPoint } from "./weather"

export type SafetyResult = {
  score: number
  level: "SAFE" | "CAUTION" | "DANGER"
  reasons: string[]
}

export function calculateSafety(weather: WeatherPoint[]): SafetyResult {
  let risk = 0
  const reasons: string[] = []

  for (const w of weather) {
    // 🌡️ Temperature risk
    if (w.temp >= 45) {
      risk += 30
      reasons.push("Extreme heat")
    } else if (w.temp >= 40) {
      risk += 20
      reasons.push("High temperature")
    }

    // 💨 Wind risk
    if (w.wind >= 20) {
      risk += 25
      reasons.push("Strong winds")
    } else if (w.wind >= 12) {
      risk += 15
      reasons.push("Moderate winds")
    }

    // 🌧️ Weather condition risk
    if (
      ["Rain", "Thunderstorm", "Snow"].includes(w.condition)
    ) {
      risk += 20
      reasons.push(w.condition)
    }

    // 💧 Humidity (fog / discomfort)
    if (w.humidity >= 90) {
      risk += 10
      reasons.push("High humidity")
    }
  }

  // Cap max risk
  risk = Math.min(risk, 100)

  const score = Math.max(100 - risk, 0)

  let level: SafetyResult["level"] = "SAFE"
  if (score < 40) level = "DANGER"
  else if (score < 70) level = "CAUTION"

  return {
    score,
    level,
    reasons: [...new Set(reasons)],
  }
}
