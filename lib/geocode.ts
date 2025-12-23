export async function geocode(place: string): Promise<[number, number]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`
  )

  const data = await res.json()

  if (!data || data.length === 0) {
    throw new Error("Location not found")
  }

  return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
}
