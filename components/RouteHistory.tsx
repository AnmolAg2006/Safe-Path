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
  onAnalyze: (from: string, to: string) => void;
  refreshKey: number;
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
    refresh();
  }, [refreshKey]);

  if (routes.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-600 space-y-2">
        <div>🕘 No recent routes yet</div>

        <button
          onClick={() => onAnalyze("Agra", "Mathura")}
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <span className="mr-1">✨</span> New here? Try Agra → Mathura
        </button>
      </div>
    );
  }

  const addOptimisticRoute = (route: SavedRoute) => {
    setRoutes((prev) => {
      // ❌ remove any existing same from→to
      const filtered = prev.filter(
        (r) => !(r.from === route.from && r.to === route.to)
      );
      return [route, ...filtered];
    });
  };

  (window as any).addOptimisticRoute = addOptimisticRoute;

  return (
    <div className="rounded-lg border bg-white p-3 shadow text-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Recent Routes
      </h2>

      {/* 👇 Scroll container */}
      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
        {routes.map((r) => (
          <motion.div
            key={r._id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border bg-gray-50 px-3 py-2 cursor-pointer"
          >
            {/* Title */}
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">
                {r.from} → {r.to}
                {r.pinned && <span className="ml-1">📌</span>}
              </div>

              {/* Risk badge */}
              <span
                className={`text-[10px] px-2 py-[2px] rounded-full ${
                  r.explanation.level === "safe"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {r.explanation.level.toUpperCase()}
              </span>
            </div>

            {/* Meta */}
            <div className="mt-1 text-xs text-gray-500">
              {r.distanceKm.toFixed(1)} km •{" "}
              {new Date(r.createdAt).toLocaleString()}
            </div>

            {/* Actions */}
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => {
                  toast.success(`Analyzing route: ${r.from} → ${r.to}`, {
                    duration: 4000,
                  });
                  onAnalyze(r.from, r.to);
                }}
                className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
              >
                ▶ Analyze
              </button>

              <button
                onClick={async () => {
                  await togglePin(r._id);
                  await refresh();

                  toast.success(
                    r.pinned ? "Route unpinned" : "Route pinned to top",
                    { duration: 1500 }
                  );
                }}
                className="rounded-md border px-2 py-1 text-xs hover:bg-white cursor-pointer"
              >
                {r.pinned ? "Un📌" : "📌"}
              </button>
                
              <button
                onClick={async () => {
                  if (!confirm("Are you sure you want to delete this route?")) return;

                  await deleteRoute(r._id);
                  await refresh();

                  toast("Route removed", {
                    icon: "🗑️",
                    duration: 1500,
                  });
                }}
                className="rounded-md border px-2 py-1 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
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
