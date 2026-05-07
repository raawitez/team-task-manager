import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', created_by: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([api.get('/projects'), api.get('/users')])
      .then(([projRes, userRes]) => {
        setProjects(projRes.data)
        setUsers(userRes.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.title || !form.created_by) return alert('Title and owner are required')
    setSubmitting(true)
    try {
      const res = await api.post('/projects', {
        ...form,
        created_by: parseInt(form.created_by)
      })
      setProjects([...projects, res.data])   // add new project to list without refetching
      setForm({ title: '', description: '', created_by: '' })
      setShowForm(false)
    } catch {
      alert('Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await api.delete(`/projects/${id}`)
    setProjects(projects.filter(p => p.id !== id))
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {/* Create Project Form */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-4">Create New Project</h2>
          <div className="space-y-3">
            <input
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Project title *"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Description (optional)"
              rows={3}
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <select
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={form.created_by}
              onChange={e => setForm({ ...form, created_by: e.target.value })}
            >
              <option value="">Select project owner *</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          No projects yet. Create your first one!
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(project => {
            const owner = users.find(u => u.id === project.created_by)
            return (
              <div key={project.id} className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-500 text-sm mt-1">{project.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Owner: {owner?.name || 'Unknown'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 hover:text-red-600 text-sm ml-4"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}