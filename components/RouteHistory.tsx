"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSortedRoutes,
  deleteRoute,
  togglePin,
  SavedRoute,
} from "@/lib/routeHistory";
import { motion } from "framer-motion";

export default function RouteHistory({
  onAnalyze,
  refreshKey,
}: {
  onAnalyze: (from: string, to: string) => void
  refreshKey: number
}) {

  const [routes, setRoutes] = useState<SavedRoute[]>([]);

  const refresh = async () => {
    const sortedRoutes = await getSortedRoutes();
    setRoutes(sortedRoutes);
  };

  // ✅ Load on mount
  useEffect(() => {
    refresh();
  }, []);

useEffect(() => {
  refresh()
}, [refreshKey])

  if (routes.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-3 text-sm text-gray-500">
        🕘 No recent routes yet
      </div>
    );
  }
  const addOptimisticRoute = (route: SavedRoute) => {
  setRoutes((prev) => {
    // ❌ remove any existing same from→to
    const filtered = prev.filter(
      (r) => !(r.from === route.from && r.to === route.to)
    )
    return [route, ...filtered]
  })
}

;(window as any).addOptimisticRoute = addOptimisticRoute


  return (
    <div className="rounded-lg border bg-white p-3 shadow text-sm">
      <div className="font-semibold mb-2">🕘 Recent Routes</div>

      {/* 👇 Scroll container */}
      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        {routes.map((r) => (
          <motion.div
            key={r._id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded border p-2 bg-gray-50"
          >
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
                onClick={async () => {
                  try {
                    await togglePin(r._id);
                    await refresh();
                    toast.success(r.pinned ? "Route unpinned" : "Route pinned");
                  } catch {
                    toast.error("Failed to update pin");
                  }
                }}
                className="border rounded px-2 py-1 text-xs hover:bg-white"
              >
                {r.pinned ? "Un📌" : "📌"}
              </button>

              <button
                onClick={async () => {
                  try {
                    await deleteRoute(r._id);
                    await refresh();
                    toast.success("Route deleted");
                  } catch {
                    toast.error("Failed to delete route");
                  }
                }}
                className="border rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                ❌
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
