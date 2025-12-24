export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<string> {
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

   return (
  data.address?.village ||
  data.address?.town ||
  data.address?.city ||
  data.address?.suburb ||
  data.address?.neighbourhood ||
  data.address?.road ||
  data.address?.county ||
  data.address?.state_district ||
  "Nearby area"
)

  } catch {
    return "Nearby area"
  }
}
