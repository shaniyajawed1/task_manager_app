import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    const storedToken = localStorage.getItem('currentToken')
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
  }, [])

  const login = (userData) => {
    // Check if user exists in registered users
    const registeredUsers = localStorage.getItem('registeredUsers')
    const users = registeredUsers ? JSON.parse(registeredUsers) : {}
    
    // For demo, allow any login
    const fakeToken = 'fake-jwt-token-' + Date.now()
    setUser(userData)
    setToken(fakeToken)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('currentToken', fakeToken)
  }

  const register = (userData) => {
    // Save registered user
    const registeredUsers = localStorage.getItem('registeredUsers')
    const users = registeredUsers ? JSON.parse(registeredUsers) : {}
    users[userData.email] = userData
    localStorage.setItem('registeredUsers', JSON.stringify(users))
    
    // Auto login after registration
    const fakeToken = 'fake-jwt-token-' + Date.now()
    setUser(userData)
    setToken(fakeToken)
    localStorage.setItem('currentUser', JSON.stringify(userData))
    localStorage.setItem('currentToken', fakeToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('currentUser')
    localStorage.removeItem('currentToken')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
