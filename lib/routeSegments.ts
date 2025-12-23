import { WeatherPoint } from "./weather"

export type RouteSegment = {
  points: [number, number][]
  level: "SAFE" | "CAUTION" | "DANGER"
}

export function buildRouteSegments(
  route: [number, number][],
  weather: WeatherPoint[]
): RouteSegment[] {
  if (!route.length || !weather.length) return []

  const segments: RouteSegment[] = []
  const segmentLength = Math.floor(route.length / weather.length) || 1

  for (let i = 0; i < weather.length; i++) {
    const start = i * segmentLength
    const end = i === weather.length - 1
      ? route.length
      : (i + 1) * segmentLength

    const w = weather[i]

    let level: RouteSegment["level"] = "SAFE"

    if (
      w.temp >= 40 ||
      w.wind >= 15 ||
      ["Rain", "Thunderstorm", "Snow"].includes(w.condition)
    ) {
      level = "CAUTION"
    }

    if (
      w.temp >= 45 ||
      w.wind >= 25 ||
      w.condition === "Thunderstorm"
    ) {
      level = "DANGER"
    }

    segments.push({
      points: route.slice(start, end),
      level,
    })
  }

  return segments
}
