import type { RouteExplanation } from "./routeExplanation"

export type SavedRoute = {
  id: string
  from: string
  to: string
  distanceKm: number
  riskZones: number
  explanation: RouteExplanation
  timestamp: number
  pinned?: boolean   // ✅ NEW
}


const KEY = "safepath-history"
const MAX = 5

export function saveRoute(route: SavedRoute) {
  const existing: SavedRoute[] =
    JSON.parse(localStorage.getItem(KEY) || "[]")

  // remove duplicate (same from → to)
  const filtered = existing.filter(
    r => !(r.from === route.from && r.to === route.to)
  )

  const updated = [route, ...filtered].slice(0, MAX)
  localStorage.setItem(KEY, JSON.stringify(updated))
}


export function getSavedRoutes(): SavedRoute[] {
  return JSON.parse(localStorage.getItem(KEY) || "[]")
}
export function deleteRoute(id: string) {
  const routes: SavedRoute[] =
    JSON.parse(localStorage.getItem(KEY) || "[]")

  localStorage.setItem(
    KEY,
    JSON.stringify(routes.filter(r => r.id !== id))
  )
}

export function togglePin(id: string) {
  const routes: SavedRoute[] =
    JSON.parse(localStorage.getItem(KEY) || "[]")

  const updated = routes.map(r =>
    r.id === id ? { ...r, pinned: !r.pinned } : r
  )

  // pinned routes on top
  updated.sort((a, b) =>
    a.pinned === b.pinned ? b.timestamp - a.timestamp : a.pinned ? -1 : 1
  )

  localStorage.setItem(KEY, JSON.stringify(updated))
}
export function getSortedRoutes(): SavedRoute[] {
  const routes: SavedRoute[] =
    JSON.parse(localStorage.getItem(KEY) || "[]")

  return routes.sort((a, b) =>
    a.pinned === b.pinned
      ? b.timestamp - a.timestamp
      : a.pinned
      ? -1
      : 1
  )
}
