'use client'

import { useState, useEffect } from 'react'
import { loginUser, registerUser, logoutUser, getCurrentUser, isAuthenticated } from '@/services/users'
import type { User } from '@/services/users'

interface UseAuthReturn {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<boolean>
  register: (userData: { name: string; email: string; password: string; [key: string]: any }) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    setIsLoading(true)
    try {
      const result = await loginUser(credentials)
      
      if ('error' in result) {
        setIsLoading(false)
        return false
      }
      
      setUser(result.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: { 
    name: string; 
    email: string; 
    password: string; 
    [key: string]: any 
  }): Promise<boolean> => {
    setIsLoading(true)
    try {
      const result = await registerUser(userData)
      
      if ('error' in result) {
        setIsLoading(false)
        return false
      }
      
      setUser(result.user)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Registration error:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = (): void => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
  }

  return {
    user,
    isLoggedIn: isAuthenticated(),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }
}

// Export the User type for use in other components
export type { User }
