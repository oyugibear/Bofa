'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import { FormInput, FormButton } from '../../../components/constants'
import { authAPI } from '../../../lib/auth'
import { useAuth } from '../../../contexts/AuthContext'
import { useToast } from '../../../components/Providers/ToastProvider'

interface LoginForm {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()
  const toast = useToast()
  const { login: authLogin, isAuthenticated, isLoading } = useAuth()
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // User is already logged in, redirect to homepage
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8726FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.login(formData.email, formData.password)
      
      if (!response.user || !response.token) {
        toast.error("Login failed. Please check your credentials.")
        return
      }
      
      // Use the auth context to store user data securely
      authLogin(response.user, response.token)
      
      toast.success('Login successful!')
      
      // Redirect based on user role - Admin goes to admin, others go to homepage
      const userRole = response.user.role
      if (userRole === 'Admin') {
        router.push('/admin')
      } else {
        router.push('/') // Redirect to homepage for regular users
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserOutlined className="text-white text-3xl" color='#fff' />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your Arena 03 Kilifi account</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              icon={<UserOutlined className="text-gray-400" />}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              error={errors.password}
              required
              icon={<LockOutlined className="text-gray-400" />}
            />

            <div className="flex items-center justify-between">

              <div className="text-sm">
                <Link 
                  href="/auth/forgot_password" 
                  className="font-medium text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <FormButton
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="mt-6"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </FormButton>
          </form>




          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="font-medium text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
