"use client"

import { useState } from "react"
import RoutePanel from "@/components/RoutePanel"
import MapView from "@/components/MapView"
import { getRoute } from "@/lib/route"
import { sampleRoute } from "@/lib/routeSample"
import { getForecastWeather, WeatherPoint } from "@/lib/weather"
import { calculateSafety } from "@/lib/safety"
import { SafetyResult } from "@/lib/safety"
import { buildRouteSegments } from "@/lib/routeSegments"
import { RouteSegment } from "@/lib/routeSegments"
import RouteLegend from "@/components/RouteLegend"

export default function DashboardPage() {
  const [start, setStart] = useState<[number, number]>()
  const [end, setEnd] = useState<[number, number]>()
  const [route, setRoute] = useState<[number, number][]>([])
  const [weather, setWeather] = useState<WeatherPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [safety, setSafety] = useState<SafetyResult | null>(null)
  const [segments, setSegments] = useState<RouteSegment[]>([])

  async function onAnalyze(
    s: [number, number],
    e: [number, number]
  ) {
    try {
      setLoading(true)

      // 1️⃣ Save start & end
      setStart(s)
      setEnd(e)

      // 2️⃣ Get real road route
      const result = await getRoute(s, e)
      setRoute(result.route)

      // 3️⃣ Sample points along route
      const points = sampleRoute(result.route)

      // 4️⃣ Fetch weather for each sample point
      const weatherDataNested = await Promise.all(
  points.map(([lat, lng]) => getForecastWeather(lat, lng))
)

// Flatten forecasts
const weatherData = weatherDataNested.flat()

      const segs = buildRouteSegments(result.route, weatherData)
setSegments(segs)

      const safetyResult = calculateSafety(weatherData)
setSafety(safetyResult)

console.log("Safety:", safetyResult)

      setWeather(weatherData)

      console.log("Weather along route:", weatherData)
    } catch (err: any) {
  alert(
    "Route is too long or unsupported by the routing service. Try a shorter route."
  )
}
 finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome, Anmol Agarwal
        </h1>
        <p className="text-gray-300">
          Trust Score: <span className="text-white">75</span>
        </p>
      </div>
      {safety && (
  <div
    className={`p-4 rounded-xl border text-white ${
      safety.level === "SAFE"
        ? "bg-green-600"
        : safety.level === "CAUTION"
        ? "bg-yellow-500"
        : "bg-red-600"
    }`}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">
        Route Safety: {safety.level}
      </h3>
      <span className="text-2xl font-bold">
        {safety.score}/100
      </span>
    </div>

    {safety.reasons.length > 0 && (
      <p className="mt-2 text-sm">
        Risks: {safety.reasons.join(", ")}
      </p>
    )}
  </div>
)}

      {/* Route + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left panel */}
  <div className="space-y-4">
    <RoutePanel onAnalyze={onAnalyze} loading={loading} />
    <RouteLegend />
  </div>

  {/* Map */}
  <div className="lg:col-span-2">
    <MapView segments={segments} />
  </div>
</div>

    </div>
  )
}
