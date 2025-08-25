import { authStorage } from './auth'

export const logout = () => {
  authStorage.clearAll()
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

export const isAuthenticated = (): boolean => {
  const token = authStorage.getToken()
  const user = authStorage.getUser()
  return !!(token && user)
}

export const getCurrentUser = () => {
  return authStorage.getUser()
}

export const getAuthToken = () => {
  return authStorage.getToken()
}

export const requireAuth = (redirectTo: string = '/auth/login') => {
  if (!isAuthenticated() && typeof window !== 'undefined') {
    window.location.href = redirectTo
    return false
  }
  return true
}

export const requireAdmin = (redirectTo: string = '/') => {
  if (!isAuthenticated()) {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
    return false
  }
  
  const user = getCurrentUser()
  if (user?.role !== 'Admin') {
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
    return false
  }
  
  return true
}
