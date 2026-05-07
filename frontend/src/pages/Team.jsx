import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Team() {
  const [users, setUsers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })

  useEffect(() => {
    Promise.all([api.get('/users'), api.get('/tasks')])
      .then(([userRes, taskRes]) => {
        setUsers(userRes.data)
        setTasks(taskRes.data)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert('Name and email required')
    try {
      const res = await api.post('/users', form)
      setUsers([...users, res.data])
      setForm({ name: '', email: '' })
      setShowForm(false)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create user')
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Team Members</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex gap-3">
            <input
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Full name *"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Email address *"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {users.map(user => {
          const userTasks = tasks.filter(t => t.assigned_to === user.id)
          const doneTasks = userTasks.filter(t => t.status === 'done').length
          return (
            <div key={user.id} className="bg-white border rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                {/* Avatar circle with initials */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="mt-3 flex gap-4 text-sm text-gray-500">
                <span>{userTasks.length} tasks assigned</span>
                <span>{doneTasks} completed</span>
              </div>
            </div>
          )
        })}
        {users.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            No team members yet.
          </div>
        )}
      </div>
    </div>
  )
}