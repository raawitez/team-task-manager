export default function StatCard({ title, value, color }) {
  const colorMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  }

  return (
    <div className={`rounded-xl border-2 p-6 ${colorMap[color] || colorMap.blue}`}>
      <p className="text-sm font-medium opacity-75">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  )
}