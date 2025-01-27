interface StatsCardProps {
  title: string
  value: number
  description?: string
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      {description && (
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      )}
    </div>
  )
}
