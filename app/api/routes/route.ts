import { NextResponse } from "next/server"

const ORS_KEY = process.env.ORS_KEY

if (!ORS_KEY) {
  throw new Error("Missing ORS_KEY environment variable")
}
console.log("ORS key loaded:", !!ORS_KEY)

export async function POST(req: Request) {
  try {
    const { start, end } = await req.json()

    if (
      !Array.isArray(start) ||
      !Array.isArray(end) ||
      start.length !== 2 ||
      end.length !== 2
    ) {
      return NextResponse.json(
        { error: "Invalid start or end coordinates" },
        { status: 400 }
      )
    }

    const res = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
  Authorization: ORS_KEY as string,
  "Content-Type": "application/json",
}
,
        body: JSON.stringify({
  coordinates: [
    [start[1], start[0]],
    [end[1], end[0]],
  ],
  radiuses: [2000, 2000], // 🔥 meters (1 km)
}),

      }
    )

    if (res.status === 429) {
      return NextResponse.json(
        { error: "Route service rate limit exceeded" },
        { status: 429 }
      )
    }

    if (!res.ok) {
      const text = await res.text()
      console.error("ORS error:", res.status, text)
      return NextResponse.json(
        { error: "Route service failed" },
        { status: 400 }
      )
    }

    const data = await res.json()

    if (!data.features?.length) {
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
      distance: summary.distance / 1000, // km
      duration: summary.duration / 60,   // minutes
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
