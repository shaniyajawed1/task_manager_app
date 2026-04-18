import { useNavigate } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
