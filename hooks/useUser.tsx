'use client'

import { useAuth } from '../contexts/AuthContext'

// Hook for accessing user data
export function useUser() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth()
  
  return {
    user,
    isAuthenticated,
    isLoading,
    updateUser,
    // Computed properties for easy access
    fullName: user ? `${user.first_name} ${user.second_name}` : '',
    displayName: user?.first_name || '',
    isAdmin: user?.role === 'Admin',
    userId: user?._id,
    email: user?.email,
    phone: user?.phone_number,
    role: user?.role,
    dateOfBirth: user?.date_of_birth,
    memberSince: user?.createdAt,
  }
}

// Hook for checking specific permissions
export function usePermissions() {
  const { user } = useAuth()
  
  return {
    canAccessAdmin: user?.role === 'Admin',
    canBookFields: !!user, // Any authenticated user can book
    canViewBookings: !!user,
    canEditProfile: !!user,
    canDeleteBooking: user?.role === 'Admin' || user?.role === 'Client',
    canManageUsers: user?.role === 'Admin',
    canManageServices: user?.role === 'Admin',
    canViewReports: user?.role === 'Admin',
  }
}

// Component wrapper for role-based access
export function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null 
}: { 
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode 
}) {
  const { user } = useAuth()
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}

// Component wrapper for authentication check
export function AuthGuard({ 
  children, 
  fallback = null,
  redirectTo = '/auth/login'
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
}) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8726FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    // Show a message before redirecting
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = redirectTo
      }
    }, 2000)
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please login to access the booking system.</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    )
  }
  
  return <>{children}</>
}
