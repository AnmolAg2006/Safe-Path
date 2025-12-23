import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { lat, lon } = await req.json()

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Forecast fetch failed" }, { status: 500 })
  }

  const data = await res.json()

  // return full forecast list (important)
  return NextResponse.json(data.list)
}
