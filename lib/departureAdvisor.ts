import { WeatherPoint } from "./weather"
import { calculateSafety, SafetyLevel } from "./safety"
import { RouteSegment } from "./routeSegments"

export type DepartureOption = {
  startInHours: number
  label: string
  score: number
  level: SafetyLevel
  dangerPercent: number
}

const DEPARTURE_WINDOWS = [0, 1, 2, 3, 4, 6, 9, 12, 18]

function shiftWeather(
  weather: WeatherPoint[],
  startInHours: number
): WeatherPoint[] {
  return weather.map(w => {
    const t = new Date(w.time)
    t.setHours(t.getHours() + startInHours)
    return { ...w, time: t.toISOString() }
  })
}

function evaluateDeparture(
  startInHours: number,
  weather: WeatherPoint[],
  segments: RouteSegment[]
): DepartureOption {
  const shifted = shiftWeather(weather, startInHours)
  const result = calculateSafety(shifted)

  const dangerPoints = segments.filter(
    s => s.level === "DANGER"
  ).length

  return {
    startInHours,
    label: startInHours === 0 ? "Now" : `In ${startInHours}h`,
    score: result.score,
    level: result.level,
    dangerPercent: Math.round(
      (dangerPoints / segments.length) * 100
    ),
  }
}


export function getBestDepartureTime(
  weather: WeatherPoint[],
  segments: RouteSegment[]
): {
  best: DepartureOption
  all: DepartureOption[]
} {
  const all = DEPARTURE_WINDOWS.map(h =>
    evaluateDeparture(h, weather,segments)
  )

  const safe = all.filter(o => o.dangerPercent <= 30)

  const best =
    safe.length
      ? safe.sort((a, b) => b.score - a.score)[0]
      : all.sort((a, b) => a.dangerPercent - b.dangerPercent)[0]

  return { best, all }
}
