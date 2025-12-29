export type TravelMode = "car" | "bike" | "walk"

export const TRAVEL_MODE_CONFIG = {
  car: {
    avgSpeedKmph: 45,
    riskMultiplier: 1.0,
    weatherSensitivity: 1.0,
  },
  bike: {
    avgSpeedKmph: 30,
    riskMultiplier: 1.25,
    weatherSensitivity: 1.3,
  },
  walk: {
    avgSpeedKmph: 5,
    riskMultiplier: 1.5,
    weatherSensitivity: 1.5,
  },
}
