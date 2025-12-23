export default function RouteLegend() {
  return (
    <div className="bg-white rounded-xl p-4 shadow space-y-3">
      <h3 className="font-semibold text-gray-800">
        Route Safety Legend
      </h3>

      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded bg-blue-600"></span>
        <span className="text-sm text-gray-700">
          SAFE - Normal conditions
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded bg-amber-500"></span>
        <span className="text-sm text-gray-700">
          CAUTION - Weather risk present
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-4 h-4 rounded bg-red-600"></span>
        <span className="text-sm text-gray-700">
          DANGER - Unsafe conditions
        </span>
      </div>
    </div>
  )
}
