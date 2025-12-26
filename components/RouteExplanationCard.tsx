"use client"

import { RouteExplanation } from "@/lib/routeExplanation"

const colors = {
  safe: "bg-green-100 text-green-700 border-green-300",
  moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
  risky: "bg-red-100 text-red-700 border-red-300"
}

export default function RouteExplanationCard({
  explanation
}: {
  explanation: RouteExplanation | null
}) {
  if (!explanation) return null

  return (
    <div className={`border rounded-lg p-4 mt-3 ${colors[explanation.level]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold capitalize">
          {explanation.level} route
        </span>
        <span className="text-sm font-bold">
          Safety Score: {explanation.score}/100
        </span>
      </div>

      <p className="text-sm mb-2">
        {explanation.summary}
      </p>

      <ul className="text-sm list-disc ml-5 space-y-1">
        {explanation.bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </div>
  )
}
