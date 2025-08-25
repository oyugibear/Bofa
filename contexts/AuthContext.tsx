'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, authStorage } from '../lib/auth'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshAuth: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = authStorage.getToken()
        const storedUser = authStorage.getUser()

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(storedUser)
          setError(null)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        setError('Failed to initialize authentication')
        authStorage.clearAll()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Listen for storage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token' || e.key === 'user_data') {
        try {
          const storedToken = authStorage.getToken()
          const storedUser = authStorage.getUser()

          if (!storedToken || !storedUser) {
            // Auth was cleared in another tab
            setToken(null)
            setUser(null)
            setError(null)
          } else {
            // Auth was updated in another tab
            setToken(storedToken)
            setUser(storedUser)
            setError(null)
          }
        } catch (error) {
          console.error('Error handling storage change:', error)
          setError('Authentication sync failed')
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (userData: User, userToken: string) => {
    try {
      authStorage.setToken(userToken)
      authStorage.setUser(userData)
      setToken(userToken)
      setUser(userData)
      setError(null) // Clear any previous errors on successful login
    } catch (error) {
      console.error('Error during login:', error)
      setError('Failed to save login data')
      throw error
    }
  }

  const logout = () => {
    try {
      authStorage.clearAll()
      setToken(null)
      setUser(null)
      setError(null) // Clear errors on logout
      
      // Redirect to home page after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error during logout:', error)
      setError('Logout failed')
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...userData }
        authStorage.setUser(updatedUser)
        setUser(updatedUser)
        setError(null)
      } catch (error) {
        console.error('Error updating user:', error)
        setError('Failed to update user data')
      }
    }
  }

  const refreshAuth = () => {
    try {
      const storedToken = authStorage.getToken()
      const storedUser = authStorage.getUser()

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(storedUser)
        setError(null)
      } else {
        setToken(null)
        setUser(null)
        setError(null)
      }
    } catch (error) {
      console.error('Error refreshing auth:', error)
      setError('Failed to refresh authentication')
    }
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!(token && user && authStorage.isAuthenticated()),
    isLoading,
    error,
    login,
    logout,
    updateUser,
    refreshAuth,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protecting routes
export function withAuth<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options?: {
    redirectTo?: string
    requiredRole?: string
    loadingComponent?: React.ComponentType
  }
) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading, user } = useAuth()
    const { redirectTo = '/auth/login', requiredRole, loadingComponent: LoadingComponent } = options || {}

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        window.location.href = redirectTo
      } else if (!isLoading && requiredRole && user?.role !== requiredRole) {
        window.location.href = '/'
      }
    }, [isAuthenticated, isLoading, user, redirectTo, requiredRole])

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />
      }
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8726FF] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
      return null
    }

    return <Component {...props} />
  }
}
