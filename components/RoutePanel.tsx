"use client"
import { useState } from "react"
import { geocode } from "@/lib/geocode"

export default function RoutePanel({
  onAnalyze,
  loading,
}: {
  onAnalyze: (s: [number, number], e: [number, number]) => Promise<void> | void
  loading?: boolean
}) {
  const [startText, setStartText] = useState("")
  const [endText, setEndText] = useState("")

  async function handleAnalyze() {
    try {
      const start = await geocode(startText)
      const end = await geocode(endText)
      await onAnalyze(start, end)
    } catch {
      alert("Location not found")
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl space-y-4">
      <h2 className="font-semibold text-lg">Route Planner</h2>

      <input
        className="w-full border p-2 rounded"
        placeholder="Enter starting point"
        value={startText}
        onChange={(e) => setStartText(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Enter destination"
        value={endText}
        onChange={(e) => setEndText(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Route Safety"}
      </button>
    </div>
  )
}
