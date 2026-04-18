import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function AppRoutes() {
  const { user, login, register, logout } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/register" element={<Register onRegister={register} />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} onLogout={logout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      <footer className="text-center py-4 text-gray-500 text-sm border-t mt-8">
        <p>
          Shaniya Jawed | 
          <a href="https://github.com/Shaniyajawed" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">GitHub</a> | 
          <a href="https://linkedin.com/in/shaniya-jawed" target="_blank" rel="noopener noreferrer" className="text-blue-500 ml-1">LinkedIn</a>
        </p>
      </footer>
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App
