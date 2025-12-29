import type { RouteExplanation } from "./routeExplanation"

export type SavedRoute = {
  _id: string              // MongoDB id
  from: string
  to: string
  distanceKm: number
  riskZones: number
  explanation: RouteExplanation
  createdAt: string        // ISO string from MongoDB
  pinned?: boolean
}

/* ---------------- SAVE ROUTE ---------------- */

export async function saveRoute(route: {
  from: string
  to: string
  distanceKm: number
  riskZones: number
  explanation: RouteExplanation
}) {
  try {
    await fetch("/api/routes/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: route.from,
        destination: route.to,
        distanceKm: route.distanceKm,
        riskZones: route.riskZones,
        explanation: route.explanation,
      }),
    })
  } catch (error) {
    console.error("Failed to save route:", error)
  }
}

/* ---------------- FETCH ROUTES ---------------- */

export async function getRecentRoutes(): Promise<SavedRoute[]> {
  try {
    const res = await fetch("/api/routes/list", {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch routes:", res.status)
      return []
    }

    return await res.json()
  } catch (error) {
    console.error("Failed to load routes:", error)
    return []
  }
}

export async function getSavedRoutes(): Promise<SavedRoute[]> {
  return getRecentRoutes()
}

/* ---------------- DELETE ROUTE ---------------- */
/* (Only works if you add DELETE API later) */

export async function deleteRoute(id: string) {
  try {
    await fetch(`/api/routes/${id}`, {
      method: "DELETE",
    })
  } catch (error) {
    console.error("Failed to delete route:", error)
  }
}

/* ---------------- PIN ROUTE ---------------- */
/* (Optional future feature) */

export async function togglePin(id: string) {
  try {
    await fetch(`/api/routes/${id}/pin`, {
      method: "PATCH",
    })
  } catch (error) {
    console.error("Failed to toggle pin:", error)
  }
}

/* ---------------- SORT ROUTES ---------------- */

export async function getSortedRoutes(): Promise<SavedRoute[]> {
  const routes = await getRecentRoutes()

  return routes.sort((a, b) =>
    a.pinned === b.pinned
      ? new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      : a.pinned
      ? -1
      : 1
  )
}
