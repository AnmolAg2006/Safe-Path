"use client";

import { useEffect, useState } from "react";
import {
  getSortedRoutes,
  deleteRoute,
  togglePin,
  SavedRoute,
} from "@/lib/routeHistory";

export default function RouteHistory({
  onAnalyze,
}: {
  onAnalyze: (from: string, to: string) => void;
}) {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);

  const refresh = () => {
    setRoutes(getSortedRoutes());
  };

  // ✅ Load on mount
  useEffect(() => {
    refresh();
  }, []);

  // ✅ Listen to storage updates (CRITICAL)
  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  if (routes.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-3 text-sm text-gray-500">
        🕘 No recent routes yet
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-3 shadow text-sm">
      <div className="font-semibold mb-2">🕘 Recent Routes</div>

      {/* 👇 Scroll container */}
      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        {routes.map((r) => (
          <div key={r.id} className="rounded border p-2 bg-gray-50">
            <div className="font-medium">
              {r.from} → {r.to}
              {r.pinned && <span className="ml-1">📌</span>}
            </div>

            <div className="text-xs text-gray-600 mb-2">
              {r.distanceKm.toFixed(1)} km · {r.explanation.level}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAnalyze(r.from, r.to)}
                className="flex-1 border rounded px-2 py-1 text-xs hover:bg-white"
              >
                ▶ Analyze
              </button>

              <button
                onClick={() => {
                  togglePin(r.id);
                  refresh();
                }}
                className="border rounded px-2 py-1 text-xs hover:bg-white"
                title={r.pinned ? "Unpin route" : "Pin route"}
              >
                {r.pinned ? "Un📌" : "📌"}
              </button>

              <button
                onClick={() => {
                  deleteRoute(r.id);
                  refresh();
                }}
                className="border rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                title="Delete route"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
