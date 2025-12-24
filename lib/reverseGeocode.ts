const cache = new Map<string, string>()

export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`

  // ✅ Return from cache if available
  if (cache.has(key)) {
    return cache.get(key)!
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "User-Agent": "SafePath-App",
        },
      }
    )

    const data = await res.json()

    const name =
      data.address?.village ||
      data.address?.town ||
      data.address?.city ||
      data.address?.suburb ||
      data.address?.neighbourhood ||
      data.address?.road ||
      data.address?.county ||
      data.address?.state_district ||
      "Along the route"

    // ✅ Store in cache
    cache.set(key, name)

    return name
  } catch {
    return "Along the route"
  }
}
