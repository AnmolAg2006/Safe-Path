"use client"
import { useState } from "react"
import { geocode } from "@/lib/geocode"
import { useEffect } from "react"
export default function RoutePanel({
  onAnalyze,
  loading,
  initialFrom,
  initialTo,
}: {
  onAnalyze: (
    s: [number, number],
    e: [number, number],
    from: string,
    to: string
  ) => Promise<void> | void
  loading?: boolean
  initialFrom?: string
  initialTo?: string
})
 {
  const [startText, setStartText] = useState("")
  const [endText, setEndText] = useState("")
useEffect(() => {
  if (initialFrom !== undefined) setStartText(initialFrom)
}, [initialFrom])

useEffect(() => {
  if (initialTo !== undefined) setEndText(initialTo)
}, [initialTo])

 async function handleAnalyze() {
  if (!startText || !endText) return

  try {
    const start = await geocode(startText)
    const end = await geocode(endText)

    // ✅ PASS LABELS HERE
    await onAnalyze(start, end, startText, endText)
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
