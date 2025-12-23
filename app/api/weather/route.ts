import { NextResponse } from "next/server"

const API_KEY = process.env.OPENWEATHER_KEY

export async function POST(req: Request) {
  const { lat, lng } = await req.json()

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  )

  if (!res.ok) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 })
  }

  const data = await res.json()

  return NextResponse.json({
    temp: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    condition: data.weather[0].main,
  })
}
