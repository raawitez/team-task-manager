// Dashboard.jsx
// Shows stats: total, completed, pending, overdue tasks

import { useEffect, useState } from 'react'
import api from '../api/axios'
import StatCard from '../components/StatCard'

export default function Dashboard() {
  // useState: stores the data; when it changes, React re-renders the page
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useEffect: runs once when the page loads
  useEffect(() => {
    api.get('/dashboard')
      .then(res => {
        setStats(res.data)
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load dashboard')
        setLoading(false)
      })
  }, [])   // empty [] means "run only on first load"

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-gray-500 text-lg">Loading...</div>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
      {error}
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.total_tasks} color="blue" />
        <StatCard title="Completed" value={stats.completed_tasks} color="green" />
        <StatCard title="Pending" value={stats.pending_tasks} color="yellow" />
        <StatCard title="Overdue" value={stats.overdue_tasks} color="red" />
      </div>
    </div>
  )
}