"use client"

import { useState } from "react"
import RoutePanel from "@/components/RoutePanel"
import MapView from "@/components/MapView"
import RouteLegend from "@/components/RouteLegend"
import { generateForecastAlerts, ForecastAlert } from "@/lib/alerts"
import { getRoute } from "@/lib/route"
import { sampleRoute } from "@/lib/routeSample"
import { getForecastWeather, WeatherPoint } from "@/lib/weather"
import { calculateSafety, SafetyResult } from "@/lib/safety"
import { buildRouteSegments, RouteSegment } from "@/lib/routeSegments"

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [segments, setSegments] = useState<RouteSegment[]>([])
  const [safety, setSafety] = useState<SafetyResult | null>(null)
  const [alerts, setAlerts] = useState<ForecastAlert[]>([])

  async function onAnalyze(
    start: [number, number],
    end: [number, number]
  ) {
    try {
      setLoading(true)

      /* 1️⃣ Get road route */
      const { route } = await getRoute(start, end)

      /* 2️⃣ Sample points */
      const points = sampleRoute(route)

      /* 3️⃣ ETA-aware forecast mapping */
      const now = Math.floor(Date.now() / 1000) // seconds
      
      const weatherNested = await Promise.all(
  points.map(([lat, lon]) => getForecastWeather(lat, lon))
)

const weather: WeatherPoint[] = weatherNested.flat()
  const forecastAlerts = generateForecastAlerts(weather)
setAlerts(forecastAlerts)


      /* 4️⃣ Build route segments */
      const segs = buildRouteSegments(route, weather)
      setSegments(segs)

      /* 5️⃣ Calculate overall safety */
      const safetyResult = calculateSafety(weather)
      setSafety(safetyResult)
    } catch (err) {
      alert(
        "Route too long or unsupported. Try a shorter route."
      )
    } finally {
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
      </div>


      {/* Route + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left panel */}
        <div className="space-y-4">
  <RoutePanel onAnalyze={onAnalyze} loading={loading} />
    {alerts.length > 0 && (
  <div className="space-y-2">
    {alerts.map((a, i) => (
      <div
        key={i}
        className={`p-3 rounded-lg text-sm font-medium ${
          a.severity === "SEVERE"
            ? "bg-red-600 text-white"
            : a.severity === "WARNING"
            ? "bg-yellow-500 text-black"
            : "bg-blue-500 text-white"
        }`}
      >
        ⚠️ {a.message}
      </div>
    ))}
  </div>
)}

  {/* Safety Result (compact) */}
  {safety && (
    <div
      className={`rounded-lg p-3 text-white shadow ${
        safety.level === "SAFE"
          ? "bg-green-600"
          : safety.level === "CAUTION"
          ? "bg-yellow-500"
          : "bg-red-600"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">
          Route Safety
        </span>
        <span className="text-lg font-bold">
          {safety.score}/100
        </span>
      </div>

      <p className="text-sm font-semibold mt-1">
        {safety.level}
      </p>

      {safety.reasons.length > 0 && (
        <p className="text-xs mt-1 opacity-90">
          {safety.reasons.join(", ")}
        </p>
      )}
    </div>
  )}

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
