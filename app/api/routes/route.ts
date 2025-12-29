import { NextResponse } from "next/server"

const ORS_KEY = process.env.ORS_KEY!

export async function POST(req: Request) {
  try {
    const { start, end } = await req.json()

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          "Authorization": ORS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [
            [start[1], start[0]],
            [end[1], end[0]],
          ],
        }),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error("ORS error:", res.status, text)
      try {
        const errorData = JSON.parse(text)
        return NextResponse.json(
          { error: errorData.error?.message || "Route service failed" },
          { status: 400 }
        )
      } catch {
        return NextResponse.json(
          { error: `Route service error: ${res.status}` },
          { status: 400 }
        )
      }
    }

    const data = await res.json()

    if (!data.features || !data.features.length) {
      console.error("ORS returned no features for route")
      return NextResponse.json(
        { error: "Route too long or unsupported" },
        { status: 400 }
      )
    }

    const feature = data.features[0]

    const route = feature.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    )

    const summary = feature.properties.summary

    return NextResponse.json({
      route,
      distance: summary.distance,
      duration: summary.duration,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
