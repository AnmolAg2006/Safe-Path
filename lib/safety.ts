import { WeatherPoint } from "./weather"

export type SafetyLevel = "SAFE" | "CAUTION" | "DANGER"

export type SafetyResult = {
  score: number
  level: SafetyLevel
  reasons: string[]
}

/**
 * IMD-style safety calculation
 * Conservative + gradual (no instant 0/100)
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

  let risk = 0
  const reasons = new Set<string>()

  for (const w of weather) {
    /* 🌡️ Temperature (India tuned) */
    if (w.temp >= 38) {
      risk += 6
      reasons.add("Extreme heat expected")
    } else if (w.temp >= 33) {
      risk += 3
      reasons.add("High temperature")
    }

    /* 💧 Humidity (coastal & monsoon aware) */
    if (w.humidity >= 85) {
      risk += 6
      reasons.add("Very high humidity")
    } else if (w.humidity >= 70) {
      risk += 3
      reasons.add("High humidity")
    }

    /* 💨 Wind */
    if (w.wind >= 20) {
      risk += 7
      reasons.add("Strong winds")
    } else if (w.wind >= 12) {
      risk += 4
      reasons.add("Moderate winds")
    }

    /* 🌧️ Weather conditions */
    switch (w.condition) {
      case "Thunderstorm":
        risk += 12
        reasons.add("Thunderstorm activity")
        break
      case "Rain":
      case "Drizzle":
        risk += 6
        reasons.add("Rainfall expected")
        break
      case "Fog":
      case "Mist":
        risk += 5
        reasons.add("Low visibility conditions")
        break
      case "Smoke":
      case "Haze":
        risk += 4
        reasons.add("Poor air quality")
        break
    }
  }

  /* 🧮 Normalize risk */
  const maxRisk = weather.length * 25
  const normalizedRisk = Math.min(100, Math.round((risk / maxRisk) * 100))
  const score = Math.max(0, 100 - normalizedRisk)

  /* 🚦 Safety level */
  let level: SafetyLevel = "SAFE"
  if (score <= 40) level = "DANGER"
  else if (score <= 70) level = "CAUTION"

  return {
    score,
    level,
    reasons: Array.from(reasons).slice(0, 4),
  }
}
