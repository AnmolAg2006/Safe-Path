import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { lat, lon } = await req.json()

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 })
  }

  const data = await res.json()

  return NextResponse.json({
  lat,
  lon,
  temp: data.main.temp,
  humidity: data.main.humidity,
  wind: data.wind.speed,
  condition: data.weather[0].main,
})

}
