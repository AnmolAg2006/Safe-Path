import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { lat, lon } = await req.json()

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
  )

  if (!res.ok) {
    return NextResponse.json(
      { error: "Forecast fetch failed" },
      { status: 500 }
    )
  }

  const data = await res.json()

  // Take next 6–12 hours (IMD-style)
  const forecasts = data.list.slice(0, 4).map((item: any) => ({
    lat,
    lon,
    temp: item.main.temp,
    humidity: item.main.humidity,
    wind: item.wind.speed,
    condition: item.weather[0].main,
    time: item.dt_txt,
  }))

  return NextResponse.json(forecasts)
}
