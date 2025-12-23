"use client"

import { useEffect } from "react"
import { useMap } from "react-leaflet"

export default function FitBounds({
  points,
}: {
  points: [number, number][]
}) {
  const map = useMap()

  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [40, 40] })
    }
  }, [points, map])

  return null
}
