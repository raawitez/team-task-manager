import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()  // tells us which page we're on

  // Helper: adds active styling to current page link
  const isActive = (path) =>
    location.pathname === path
      ? 'bg-blue-700 text-white'
      : 'text-blue-100 hover:bg-blue-700'

  return (
    <nav className="bg-blue-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* App name / logo */}
          <span className="text-white font-bold text-xl">
            TaskFlow
          </span>

          {/* Navigation links */}
          <div className="flex space-x-2">
            {[
              { path: '/', label: 'Dashboard' },
              { path: '/projects', label: 'Projects' },
              { path: '/tasks', label: 'Tasks' },
              { path: '/team', label: 'Team' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive(path)}`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}