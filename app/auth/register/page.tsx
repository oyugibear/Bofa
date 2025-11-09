'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons'
import { FormInput, FormButton, FormSelect } from '../../../components/constants'
import { authAPI, authStorage } from '../../../lib/auth'
import { isAuthenticated } from '../../../lib/utils'

interface RegisterForm {
  first_name: string
  second_name: string
  email: string
  phone_number: string
  date_of_birth: string
  password: string
  confirmPassword: string
  role: string
}

interface FormErrors {
  first_name?: string
  second_name?: string
  email?: string
  phone_number?: string
  date_of_birth?: string
  password?: string
  confirmPassword?: string
  role?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterForm>({
    first_name: '',
    second_name: '',
    email: '',
    phone_number: '',
    date_of_birth: '',
    password: '',
    confirmPassword: '',
    role: 'Client'
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [checking, setChecking] = useState(true)
  const [apiResponse, setApiResponse] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      if (isAuthenticated()) {
        // User is already logged in, redirect to homepage
        router.push('/')
        return
      }
      setChecking(false)
    }

    checkAuthStatus()
  }, [router])

  // Show loading while checking authentication status
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A8726FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.second_name.trim()) {
      newErrors.second_name = 'Last name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone_number) {
      newErrors.phone_number= 'Phone number is required'
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone_number)) {
      newErrors.phone_number= 'Please enter a valid phone number'
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && agreedToTerms
  }

  const handleInputChange = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (!agreedToTerms) {
      message.error('Please agree to the terms and conditions')
      return
    }

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setApiResponse({ type: 'info', message: 'Sending registration request...' })
    
    try {
      const { confirmPassword, ...userData } = formData
      
      console.log('Sending registration data:', userData)
      
      const response = await authAPI.register(userData)
      
      console.log('Registration response:', response)
      
      if (response.status && response.data) {
        setApiResponse({ type: 'success', message: `Registration successful!` })
        message.success('Account created successfully! Please check your email for verification.')
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } else {
        throw new Error(response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      // Show detailed API response errors
      let errorMessage = 'Registration failed. Please try again.'
      
      if (error instanceof Error) {
        errorMessage = error.message
        console.warn('API Error Message:', error.message)
      }
      
      // Set API response state for visual display
      setApiResponse({ type: 'error', message: `API Error: ${errorMessage}` })
      
      // Display the error message
      message.error({
        content: errorMessage,
        duration: 5,
      })
      
      // Also show a console warning with full error details
      console.warn('Full registration error details:', {
        error: error,
        timestamp: new Date().toISOString(),
        formData: formData
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] rounded-full flex items-center justify-center mx-auto mb-4">
              <UserAddOutlined className="text-white text-3xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Join Arena 03 Kilifi</h1>
            <p className="text-gray-600 mt-2">Create your account and start your football journey</p>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleInputChange('first_name')}
                error={errors.first_name}
                required
                icon={<UserOutlined className="text-gray-400" />}
              />

              <FormInput
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                value={formData.second_name}
                onChange={handleInputChange('second_name')}
                error={errors.second_name}
                required
                icon={<UserOutlined className="text-gray-400" />}
              />
            </div>

            <FormInput
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              icon={<MailOutlined className="text-gray-400" />}
            />

            <FormInput
              label="Date of Birth"
              type="date"
              placeholder="Select your date of birth"
              value={formData.date_of_birth}
              onChange={handleInputChange('date_of_birth')}
              error={errors.date_of_birth}
              required
              icon={<UserOutlined className="text-gray-400" />}
            />

            <FormInput
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleInputChange('phone_number')}
              error={errors.phone_number}
              required
              icon={<PhoneOutlined className="text-gray-400" />}
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

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={errors.confirmPassword}
              required
              icon={<LockOutlined className="text-gray-400" />}
            />

            {/* API Response Display */}
            {apiResponse && (
              <div className={`p-3 rounded-lg border text-sm ${
                apiResponse.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : apiResponse.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-blue-50 border-blue-200 text-blue-700'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {apiResponse.type === 'success' && <span className="text-green-500">✅</span>}
                    {apiResponse.type === 'error' && <span className="text-red-500">❌</span>}
                    {apiResponse.type === 'info' && <span className="text-blue-500">ℹ️</span>}
                  </div>
                  <div className="ml-2">
                    <p className="font-medium">Response:</p>
                    <p>{apiResponse.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="h-4 w-4 text-[#3A8726FF] focus:ring-[#3A8726FF] border-gray-300 rounded mt-1"
              />
              <div className="ml-3 text-sm">
                <label htmlFor="agree-terms" className="text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-[#3A8726FF] hover:text-[#2d6b1f]">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-[#3A8726FF] hover:text-[#2d6b1f]">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>

            <FormButton
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              disabled={!agreedToTerms}
              className="mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </FormButton>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="font-medium text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
