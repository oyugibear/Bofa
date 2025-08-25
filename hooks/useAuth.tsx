'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { authStorage, User } from '../lib/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = authStorage.getToken()
    const storedUser = authStorage.getUser()

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(storedUser)
    }
    
    setLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    authStorage.setToken(newToken)
    authStorage.setUser(newUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    authStorage.clearAll()
    
    // Redirect to home page after logout
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
