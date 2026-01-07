export type WeatherPoint = {
  lat: number
  lon: number
  temp: number
  humidity: number
  wind: number
  condition: string
  time: string   
}


export async function getForecastWeather(
  lat: number,
  lon: number
): Promise<WeatherPoint[]> {
  const res = await fetch("/api/weather/forecast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon }),
  })

  if (!res.ok) throw new Error("Forecast fetch failed")

  return res.json()
}
