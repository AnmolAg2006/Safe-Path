"use client";

import { useState, useEffect } from "react";
import RoutePanel from "@/components/RoutePanel";
import MapView from "@/components/MapView";
import RouteLegend from "@/components/RouteLegend";
import { generateForecastAlerts, ForecastAlert } from "@/lib/alerts";
import { getRoute } from "@/lib/route";
import { sampleRoute } from "@/lib/routeSample";
import { getForecastWeather, WeatherPoint } from "@/lib/weather";
import { calculateSafety, SafetyResult } from "@/lib/safety";
import { buildRouteSegments, RouteSegment } from "@/lib/routeSegments";
import { getBestDepartureTime } from "@/lib/departureAdvisor";
import { reverseGeocode } from "@/lib/reverseGeocode";
import { getRouteExplanation } from "@/lib/routeExplanation";
import type { RouteExplanation } from "@/lib/routeExplanation";
import RouteExplanationCard from "@/components/RouteExplanationCard";
import RouteResultCard from "@/components/RouteResultCard";
import RouteExportActions from "@/components/RouteExportActions";
import { saveRoute } from "@/lib/routeHistory"
import { nanoid } from "nanoid"
import RouteHistory from "@/components/RouteHistory";
import { geocode } from "@/lib/geocode"
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [segments, setSegments] = useState<RouteSegment[]>([]);
  const [safety, setSafety] = useState<SafetyResult | null>(null);
  const [alerts, setAlerts] = useState<ForecastAlert[]>([]);
  const [bestDeparture, setBestDeparture] = useState<{
    startInHours: number;
    label: string;
    score: number;
    level: "SAFE" | "CAUTION" | "DANGER";
    dangerPercent: number;
  } | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [focusPoint, setFocusPoint] = useState<[number, number] | null>(null);
  const [routeSummary, setRouteSummary] = useState<{
    distanceKm: number;
    riskZones: number;
    worstLevel: "SAFE" | "CAUTION" | "DANGER";
  } | null>(null);
  const [explanation, setExplanation] = useState<RouteExplanation | null>(null);
  const [fromLabel, setFromLabel] = useState("");
  const [toLabel, setToLabel] = useState("");
  async function analyzeFromHistory(from: string, to: string) {
  // ✅ 1. Fill inputs FIRST (sync)
  setFromLabel(from)
  setToLabel(to)

  try {
    setLoading(true)

    const start = await geocode(from)
    const end = await geocode(to)

    await onAnalyze(start, end, from, to)
  } catch {
    alert("Unable to analyze saved route")
  } finally {
    setLoading(false)
  }
}


  async function onAnalyze(
  start: [number, number],
  end: [number, number],
  from: string,
  to: string
) {
  setHighlightedIndex(null)
  setFocusPoint(null)

  try {
    setLoading(true)

    /* 1️⃣ Get road route */
    const { route } = await getRoute(start, end)

    /* 2️⃣ Sample points */
    const points = sampleRoute(route)

    /* 3️⃣ Forecast mapping */
    const weatherNested = await Promise.all(
      points.map(([lat, lon]) => getForecastWeather(lat, lon))
    )
    const weather: WeatherPoint[] = weatherNested.flat()

    setAlerts(generateForecastAlerts(weather))

    const segs = buildRouteSegments(route, weather)

    const totalDistanceKm = segs.reduce(
      (sum, s) => sum + (s.distanceKm ?? 0),
      0
    )

    const worstLevel = segs.some(s => s.level === "DANGER")
      ? "DANGER"
      : segs.some(s => s.level === "CAUTION")
      ? "CAUTION"
      : "SAFE"

    const riskZones = segs.filter(s => s.level !== "SAFE").length

    setRouteSummary({
      distanceKm: totalDistanceKm,
      riskZones,
      worstLevel,
    })

    /* Phase 7.1 — Explanation */
    const hour = new Date().getHours()

    const exp = getRouteExplanation({
      riskZones,
      worstLevel:
        worstLevel === "DANGER"
          ? "high"
          : worstLevel === "CAUTION"
          ? "medium"
          : "low",
      wind: weather[0]?.wind ?? 0,
      rain: weather.some(w =>
        w.condition.toLowerCase().includes("rain")
      ),
      temp: weather[0]?.temp ?? 0,
      hour,
    })

    setExplanation(exp)

    /* ✅ SAVE ROUTE CORRECTLY */
    saveRoute({
      id: nanoid(),
      from,
      to,
      distanceKm: totalDistanceKm,
      riskZones,
      explanation: exp,
      timestamp: Date.now(),
    })

    setFromLabel(from)
    setToLabel(to)

    /* Resolve place names */
    const riskySegments = segs
      .filter(s => s.level !== "SAFE")
      .slice(0, 6)

    await Promise.all(
      riskySegments.map(async s => {
        const mid = s.points[Math.floor(s.points.length / 2)]
        s.placeName = await reverseGeocode(mid[0], mid[1])
      })
    )

    setSegments(segs)

    const { best } = getBestDepartureTime(weather, segs)
    setBestDeparture(best)
    setSafety(calculateSafety(weather))

  } catch {
    alert("Route too long or unsupported. Try a shorter route.")
  } finally {
    setLoading(false)
  }
}


  function resetMapView() {
    setFocusPoint(null);
    setHighlightedIndex(null);
  }

  function buildRiskGroups(segments: RouteSegment[]) {
    const groups: {
      startIndex: number;
      endIndex: number;
      level: "DANGER" | "CAUTION";
      reasons: string[];
      segments: RouteSegment[];
    }[] = [];

    let current: any = null;

    segments.forEach((s, idx) => {
      if (s.level === "SAFE") {
        current = null;
        return;
      }

      const key = s.level + "|" + s.reasons.join(",");

      if (current && current.key === key && idx === current.endIndex + 1) {
        current.endIndex = idx;
        current.segments.push(s);
      } else {
        current = {
          key,
          startIndex: idx,
          endIndex: idx,
          level: s.level,
          reasons: s.reasons,
          segments: [s],
        };
        groups.push(current);
      }
    });

    return groups;
  }
  const riskGroups = buildRiskGroups(segments).sort((a, b) => {
    if (a.level !== b.level) {
      return a.level === "DANGER" ? -1 : 1;
    }
    return b.segments.length - a.segments.length;
  });

  return (
  <div className="p-6 space-y-6">
    {/* Header */}
    <h1 className="text-2xl font-bold">Welcome, Anmol Agarwal</h1>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT PANEL */}
      <div className="space-y-4">
        {/* Route Planner */}
        <RoutePanel
          loading={loading}
          initialFrom={fromLabel}
          initialTo={toLabel}
          onAnalyze={(s, e, from, to) => {
            setFromLabel(from)
            setToLabel(to)
            onAnalyze(s, e, from, to)
          }}
        />

        {/* Route Result + Export (ONLY after analyze) */}
        {explanation && routeSummary && (
          <>
          <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.1 }}
>


            <RouteResultCard
              explanation={explanation}
              distanceKm={routeSummary.distanceKm}
              riskZones={routeSummary.riskZones}
            />
</motion.div>
            <RouteExportActions
              from={fromLabel}
              to={toLabel}
              distanceKm={routeSummary.distanceKm}
              riskZones={routeSummary.riskZones}
              explanation={explanation}
            />
          </>
        )}

        {/* Recent Routes (always visible) */}
        <RouteHistory onAnalyze={analyzeFromHistory} />

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            {alerts.map((a, i) => (
                <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 rounded-lg text-sm font-medium ${
                  a.severity === "SEVERE"
                  ? "bg-red-600 text-white"
                  : a.severity === "WARNING"
                  ? "bg-yellow-500 text-black"
                  : "bg-blue-500 text-white"
                }`}
                >
                ⚠️ {a.message}
                </motion.div>
            ))}
          </div>
        )}

        
      </div>

      {/* RIGHT PANEL */}
      <div className="lg:col-span-3 space-y-4">
        {/* Exportable Area (Map + compact result for image) */}
        <div
          id="route-export"
          className="bg-white p-3 rounded-lg shadow"
        >
          <MapView
            segments={segments}
            highlightedIndex={highlightedIndex}
            focusPoint={focusPoint}
          />

        </div>

        {/* Supporting Info */}
        {bestDeparture && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RouteLegend />

            <div className="rounded-lg p-3 border bg-white shadow text-sm">
              <div className="text-gray-500">Best departure time</div>

              <div className="flex items-center justify-between mt-1">
                <span className="font-semibold text-lg">
                  {bestDeparture.label}
                </span>

                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    bestDeparture.level === "SAFE"
                      ? "bg-green-100 text-green-700"
                      : bestDeparture.level === "CAUTION"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {bestDeparture.level}
                </span>
              </div>

              <div className="text-xs text-gray-600 mt-1">
                Safety score: {bestDeparture.score} · Dangerous segments:{" "}
                {bestDeparture.dangerPercent}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
)


}
