import { WeatherPoint } from "./weather"

export type SafetyLevel = "SAFE" | "CAUTION" | "DANGER"

export type SafetyResult = {
  score: number
  level: SafetyLevel
  reasons: string[]
}

/**
 * IMD-style safety calculation
 * - Gradual penalties
 * - No instant 0 score
 * - Realistic thresholds
 */
export function calculateSafety(
  weather: WeatherPoint[]
): SafetyResult {
  if (!weather.length) {
    return {
      score: 100,
      level: "SAFE",
      reasons: [],
    }
  }

  let score = 100
  const reasonsSet = new Set<string>()

  for (const w of weather) {
    // 🌡 Temperature
    if (w.temp >= 38 && w.temp < 42) {
      score -= 5
      reasonsSet.add("High temperature")
    }
    if (w.temp >= 42) {
      score -= 10
      reasonsSet.add("Extreme heat")
    }

    // 💧 Humidity
    if (w.humidity >= 80 && w.humidity < 90) {
      score -= 5
      reasonsSet.add("High humidity")
    }
    if (w.humidity >= 90) {
      score -= 8
      reasonsSet.add("Very high humidity")
    }

    // 💨 Wind
    if (w.wind >= 12 && w.wind < 20) {
      score -= 8
      reasonsSet.add("Strong winds")
    }
    if (w.wind >= 20) {
      score -= 15
      reasonsSet.add("Very strong winds")
    }

    // 🌧 Weather condition
    if (w.condition === "Rain") {
      score -= 8
      reasonsSet.add("Rainfall expected")
    }

    if (w.condition === "Thunderstorm") {
      score -= 20
      reasonsSet.add("Thunderstorm risk")
    }

    if (w.condition === "Snow") {
      score -= 25
      reasonsSet.add("Snow conditions")
    }

    if (w.condition === "Fog" || w.condition === "Haze") {
      score -= 6
      reasonsSet.add("Low visibility")
    }
  }

  // 🛑 Clamp score (IMD never shows absolute zero)
  score = Math.max(20, Math.min(100, score))

  // 🚦 Safety level mapping
  let level: SafetyLevel = "SAFE"

  if (score < 70) level = "CAUTION"
  if (score < 40) level = "DANGER"

  return {
    score: Math.round(score),
    level,
    reasons: Array.from(reasonsSet),
  }
}
