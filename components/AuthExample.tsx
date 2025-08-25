'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthExample() {
  const { user, isLoggedIn, isLoading, login, register, logout } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLoginMode) {
      const success = await login({
        email: formData.email,
        password: formData.password
      })
      if (success) {
        setFormData({ name: '', email: '', password: '' })
      }
    } else {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      if (success) {
        setFormData({ name: '', email: '', password: '' })
      }
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isLoggedIn && user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex mb-4">
        <button
          onClick={() => setIsLoginMode(true)}
          className={`flex-1 py-2 px-4 text-center ${
            isLoginMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-l-lg transition-colors`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLoginMode(false)}
          className={`flex-1 py-2 px-4 text-center ${
            !isLoginMode
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          } rounded-r-lg transition-colors`}
        >
          Register
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginMode && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isLoginMode}
            />
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : isLoginMode ? 'Login' : 'Register'}
        </button>
      </form>
    </div>
  )
}
