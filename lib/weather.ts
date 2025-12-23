export type WeatherPoint = {
  temp: number
  humidity: number
  wind: number
  condition: string
}

export async function getWeather(
  lat: number,
  lng: number
): Promise<WeatherPoint> {
  const res = await fetch("/api/weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  })

  if (!res.ok) {
    throw new Error("Weather fetch failed")
  }

  return res.json()
}
