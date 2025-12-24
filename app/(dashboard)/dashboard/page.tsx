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

  async function onAnalyze(start: [number, number], end: [number, number]) {
    setHighlightedIndex(null);
    setFocusPoint(null);

    try {
      setLoading(true);

      /* 1️⃣ Get road route */
      const { route } = await getRoute(start, end);

      /* 2️⃣ Sample points */
      const points = sampleRoute(route);

      /* 3️⃣ ETA-aware forecast mapping */
      const now = Math.floor(Date.now() / 1000); // seconds

      const weatherNested = await Promise.all(
        points.map(([lat, lon]) => getForecastWeather(lat, lon))
      );

      const weather: WeatherPoint[] = weatherNested.flat();

      const forecastAlerts = generateForecastAlerts(weather);
      setAlerts(forecastAlerts);

      const segs = buildRouteSegments(route, weather);
      const totalDistanceKm = segs.reduce(
        (sum, s) => sum + (s.distanceKm ?? 0),
        0
      );

      const worstLevel = segs.some((s) => s.level === "DANGER")
        ? "DANGER"
        : segs.some((s) => s.level === "CAUTION")
        ? "CAUTION"
        : "SAFE";

      const riskZones = segs.filter((s) => s.level !== "SAFE").length;
      setRouteSummary({
        distanceKm: totalDistanceKm,
        riskZones,
        worstLevel,
      });

      // 🔹 Resolve place names ONLY for risky segments (max 6)
      const riskySegments = segs
        .map((s, idx) => ({ s, idx }))
        .filter(({ s }) => s.level !== "SAFE")
        .slice(0, 6);

      await Promise.all(
        riskySegments.map(async ({ s }) => {
          const mid = s.points[Math.floor(s.points.length / 2)];
          s.placeName = await reverseGeocode(mid[0], mid[1]);
        })
      );

      setSegments(segs);

      /* ⭐ Phase 4: Best departure time */
      const { best } = getBestDepartureTime(weather, segs);

      setBestDeparture(best);
      const safetyResult = calculateSafety(weather);
      setSafety(safetyResult);
    } catch (err) {
      alert("Route too long or unsupported. Try a shorter route.");
    } finally {
      setLoading(false);
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
      <div>
        <h1 className="text-2xl font-bold ">Welcome, Anmol Agarwal</h1>
      </div>

      {/* Route + Map */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
        {/* Left panel */}
        <div className="space-y-4 ">
            {routeSummary && (
              <div className="rounded-lg border bg-white p-3 text-sm shadow">
                <div className="font-semibold text-gray-700 mb-2">
                  Route Summary
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>Distance</div>
                  <div>{routeSummary.distanceKm.toFixed(1)} km</div>

                  <div>Risk zones</div>
                  <div>{routeSummary.riskZones}</div>

                  <div>Worst level</div>
                  <div className="font-semibold">{routeSummary.worstLevel}</div>
                </div>
              </div>
            )}

          <RoutePanel onAnalyze={onAnalyze} loading={loading} />
          {alerts.length > 0 && (
            <div className="space-y-2 ">
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
                <span className="font-semibold text-sm">Route Safety</span>
                <span className="text-lg font-bold">{safety.score}/100</span>
              </div>

              <p className="text-sm font-semibold mt-1">{safety.level}</p>

              {safety.reasons.length > 0 && (
                <p className="text-xs mt-1 opacity-90">
                  {safety.reasons.join(", ")}
                </p>
              )}
            </div>
          )}
          {segments.length > 0 && (
            <div className="rounded-lg border bg-white p-3 text-sm shadow max-h-64 overflow-y-auto">
              <div className="font-semibold text-gray-700 mb-2">
                ⚠️ Risk Breakdown
              </div>

              <div className="space-y-2">
                {segments.map((s, idx) => {
                  if (s.level === "SAFE" || s.reasons.length === 0) return null;

                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      onMouseLeave={() => setHighlightedIndex(null)}
                      onClick={() => {
                        const mid = s.points[Math.floor(s.points.length / 2)];
                        setFocusPoint(mid);

                        // setTimeout(() => setFocusPoint(null), 1000);
                      }}
                      className="cursor-pointer rounded p-2 hover:bg-gray-100"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {s.placeName && s.placeName !== "Nearby area"
                            ? s.placeName
                            : "Along the route"}
                        </span>

                        <span
                          className={`text-xs font-bold ${
                            s.level === "DANGER"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {s.level}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mt-1">
                        {s.reasons.join(", ")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-3 space-y-4">
          <MapView
            segments={segments}
            highlightedIndex={highlightedIndex}
            focusPoint={focusPoint}
          />

          {/* Summary below map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bestDeparture && <RouteLegend />}

            {bestDeparture && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
