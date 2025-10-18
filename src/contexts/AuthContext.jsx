import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Kiểm tra token và user trong localStorage khi app khởi động
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setToken(savedToken)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        // Nếu có lỗi, clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken)
    setIsAuthenticated(true)
    localStorage.setItem('token', userToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    console.log('🔓 Logging out user...')
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('✅ Logout completed, localStorage cleared')
  }

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}