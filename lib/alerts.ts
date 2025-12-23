import { WeatherPoint } from "./weather"

export type ForecastAlert = {
  type: "RAIN" | "WIND" | "VISIBILITY" | "HEAT"
  message: string
  severity: "INFO" | "WARNING" | "SEVERE"
}

/**
 * IMD-style forecast alerts
 */
export function generateForecastAlerts(
  weather: WeatherPoint[]
): ForecastAlert[] {
  const alerts: ForecastAlert[] = []

  for (const w of weather) {
    const hour = new Date(w.time).getHours()

    /* 🌧️ Rain alerts */
    if (["Rain", "Thunderstorm"].includes(w.condition)) {
      if (hour >= 18) {
        alerts.push({
          type: "RAIN",
          severity: "SEVERE",
          message: "Heavy rain expected after 6 PM",
        })
      } else {
        alerts.push({
          type: "RAIN",
          severity: "WARNING",
          message: "Rainfall expected along the route",
        })
      }
    }

    /* 💨 Wind alerts */
    if (w.wind >= 15) {
      alerts.push({
        type: "WIND",
        severity: w.wind >= 25 ? "SEVERE" : "WARNING",
        message: "Strong winds expected in upcoming hours",
      })
    }

    /* 🌫️ Visibility alerts */
    if (
      w.humidity >= 85 &&
      hour >= 19
    ) {
      alerts.push({
        type: "VISIBILITY",
        severity: "WARNING",
        message: "Low visibility likely during night hours",
      })
    }

    /* 🌡️ Heat alerts */
    if (w.temp >= 40) {
      alerts.push({
        type: "HEAT",
        severity: "WARNING",
        message: "Extreme heat conditions expected",
      })
    }
  }

  /* 🔥 Remove duplicates */
  const unique = new Map(alerts.map(a => [a.message, a]))
  return Array.from(unique.values())
}
