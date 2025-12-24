import { WeatherPoint } from "./weather"

export type RouteSegment = {
  points: [number, number][]
  level: "SAFE" | "CAUTION" | "DANGER"
  weather: WeatherPoint
  arrivalTime: string
}

const AVG_SPEED_KMH = 50

function haversineKm(
  a: [number, number],
  b: [number, number]
) {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2

  return 2 * R * Math.asin(Math.sqrt(x))
}

export function buildRouteSegments(
  route: [number, number][],
  weather: WeatherPoint[]
): RouteSegment[] {
  if (!route.length || !weather.length) return []

  const segments: RouteSegment[] = []
  const segmentLength = Math.floor(route.length / weather.length) || 1

  let cumulativeKm = 0
  const startTime = Date.now()

  for (let i = 0; i < weather.length; i++) {
    const startIdx = i * segmentLength
    const endIdx =
      i === weather.length - 1
        ? route.length
        : (i + 1) * segmentLength

    const points = route.slice(startIdx, endIdx)
    const w = weather[i]

    // distance for this segment
    for (let j = 1; j < points.length; j++) {
      cumulativeKm += haversineKm(points[j - 1], points[j])
    }

    const travelHours = cumulativeKm / AVG_SPEED_KMH
    const arrivalTime = new Date(
      startTime + travelHours * 3600 * 1000
    ).toISOString()

    let level: RouteSegment["level"] = "SAFE"

    if (
      w.temp >= 45 ||
      w.wind >= 25 ||
      w.humidity >= 90 ||
      w.condition === "Thunderstorm"
    ) {
      level = "DANGER"
    } else if (
      w.temp >= 38 ||
      w.wind >= 15 ||
      w.humidity >= 80 ||
      ["Rain", "Snow"].includes(w.condition)
    ) {
      level = "CAUTION"
    }

    segments.push({
      points,
      level,
      weather: w,
      arrivalTime,
    })
  }

  return segments
}
