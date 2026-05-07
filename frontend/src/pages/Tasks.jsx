import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS_COLORS = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

export default function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', status: 'todo',
    due_date: '', project_id: '', assigned_to: ''
  })

  useEffect(() => {
    Promise.all([api.get('/tasks'), api.get('/projects'), api.get('/users')])
      .then(([taskRes, projRes, userRes]) => {
        setTasks(taskRes.data)
        setProjects(projRes.data)
        setUsers(userRes.data)
        setLoading(false)
      })
  }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.project_id) return alert('Title and project required')
    try {
      const payload = {
        title: form.title,
        description: form.description || null,
        status: form.status,
        due_date: form.due_date || null,
        project_id: parseInt(form.project_id),
        assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      }
      const res = await api.post('/tasks', payload)
      setTasks([...tasks, res.data])
      setForm({ title: '', description: '', status: 'todo', due_date: '', project_id: '', assigned_to: '' })
      setShowForm(false)
    } catch {
      alert('Failed to create task')
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const res = await api.patch(`/tasks/${taskId}`, { status: newStatus })
    setTasks(tasks.map(t => t.id === taskId ? res.data : t))
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return
    await api.delete(`/tasks/${id}`)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'done') return false
    return new Date(task.due_date) < new Date()
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <div className="grid md:grid-cols-2 gap-3">
            <input
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Task title *"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={form.project_id}
              onChange={e => setForm({ ...form, project_id: e.target.value })}
            >
              <option value="">Select project *</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <select
              className="border rounded-lg px-3 py-2"
              value={form.assigned_to}
              onChange={e => setForm({ ...form, assigned_to: e.target.value })}
            >
              <option value="">Assign to (optional)</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <select
              className="border rounded-lg px-3 py-2"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={form.due_date}
              onChange={e => setForm({ ...form, due_date: e.target.value })}
            />
            <textarea
              className="border rounded-lg px-3 py-2 md:col-span-2"
              placeholder="Description"
              rows={2}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button
            onClick={handleSubmit}
            className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      )}

      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-16 text-gray-400">No tasks yet.</div>
        )}
        {tasks.map(task => {
          const assignee = users.find(u => u.id === task.assigned_to)
          const project = projects.find(p => p.id === task.project_id)
          const overdue = isOverdue(task)
          return (
            <div
              key={task.id}
              className={`bg-white border rounded-xl p-4 shadow-sm flex items-start justify-between ${overdue ? 'border-red-300' : ''}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-800">{task.title}</span>
                  {overdue && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      OVERDUE
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1 space-x-3">
                  {project && <span>📁 {project.title}</span>}
                  {assignee && <span>👤 {assignee.name}</span>}
                  {task.due_date && <span>📅 {task.due_date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <select
                  className="text-sm border rounded px-2 py-1"
                  value={task.status}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}