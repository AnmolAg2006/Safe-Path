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
    <div className="bg-white p-4 rounded-xl space-y-4 border-1 shadow-md">
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
        onKeyDown={(e) => {
    if (e.key === "Enter" && !loading) {
      handleAnalyze()
    }
  }}
      />

      <button
  onClick={handleAnalyze}
  disabled={loading}
  className={`
    w-full flex items-center justify-center gap-2
    rounded-lg px-4 py-2.5 text-sm font-semibold
    transition-all duration-200
    ${
      loading
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
    }
  `}
>
  {loading ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      Analyzing…
    </>
  ) : (
    "Analyze route"
  )}
</button>

    </div>
  )
}
