export type RouteResult = {
  route: [number, number][]
  distance: number
  duration: number
}

export async function getRoute(
  start: [number, number],
  end: [number, number]
): Promise<RouteResult> {
  const res = await fetch("/api/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ start, end }),
  })

  if (!res.ok) {
    throw new Error("Route fetch failed")
  }

  const data = await res.json()

  return {
    route: data.route,
    distance: data.distance,
    duration: data.duration,
  }
}
