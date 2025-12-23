import { WeatherPoint } from "./weather";

export type RouteSegment = {
  points: [number, number][];
  level: "SAFE" | "CAUTION" | "DANGER";
  weather: WeatherPoint;
};

export function buildRouteSegments(
  route: [number, number][],
  weather: WeatherPoint[]
): RouteSegment[] {
  if (!route.length || !weather.length) return [];

  const segments: RouteSegment[] = [];
  const segmentLength = Math.floor(route.length / weather.length) || 1;

  for (let i = 0; i < weather.length; i++) {
    const start = i * segmentLength;
    const end =
      i === weather.length - 1 ? route.length : (i + 1) * segmentLength;

    const w = weather[i];

    let level: RouteSegment["level"] = "SAFE"

// 🌡 Heat
if (w.temp >= 38) level = "CAUTION"

// 💧 Humidity (KEY FIX)
if (w.humidity >= 75) level = "CAUTION"
if (w.humidity >= 85) level = "DANGER"

// 💨 Wind
if (w.wind >= 12) level = "CAUTION"
if (w.wind >= 18) level = "DANGER"

// 🌧 Weather
if (["Rain", "Thunderstorm"].includes(w.condition)) {
  level = "DANGER"
}


    segments.push({
      points: route.slice(start, end),
      level,
      weather: w,
    });
  }

  return segments;
}
