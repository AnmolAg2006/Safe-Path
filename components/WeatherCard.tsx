type Props = {
  label: string
  value: string
}

export default function WeatherCard({ label, value }: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm border">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  )
}
