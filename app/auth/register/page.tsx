'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons'
import { FormInput, FormButton } from '../../../components/constants'
import { authAPI } from '../../../lib/auth'
import { isAuthenticated } from '../../../lib/utils'
import { useAuth } from '../../../contexts/AuthContext'

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

const countryCodes = [
  { code: '+254', country: 'Kenya', label: 'KE +254' },
  { code: '+255', country: 'Tanzania', label: 'TZ +255' },
  { code: '+256', country: 'Uganda', label: 'UG +256' },
  { code: '+250', country: 'Rwanda', label: 'RW +250' },
  { code: '+251', country: 'Ethiopia', label: 'ET +251' },
  { code: '+27', country: 'South Africa', label: 'ZA +27' },
  { code: '+234', country: 'Nigeria', label: 'NG +234' },
  { code: '+233', country: 'Ghana', label: 'GH +233' },
  { code: '+1', country: 'United States', label: 'US +1' },
  { code: '+44', country: 'United Kingdom', label: 'UK +44' },
]

const stripControlCharacters = (value: string) => value.replace(/[\u0000-\u001F\u007F]/g, '')

const sanitizeName = (value: string) =>
  stripControlCharacters(value)
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const sanitizeNameInput = (value: string) =>
  stripControlCharacters(value)
    .replace(/[<>]/g, '')
    .replace(/\s{2,}/g, ' ')

const sanitizeEmail = (value: string) =>
  stripControlCharacters(value)
    .replace(/[<>\s]/g, '')
    .trim()
    .toLowerCase()

const sanitizePhoneInput = (value: string) =>
  stripControlCharacters(value)
    .replace(/[^\d\s()+-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const sanitizeDate = (value: string) => value.replace(/[^\d-]/g, '').slice(0, 10)

const normalizePhoneNumber = (phoneNumber: string, countryCode: string) => {
  const dialCodeDigits = countryCode.replace(/\D/g, '')
  const trimmedPhone = sanitizePhoneInput(phoneNumber)

  if (trimmedPhone.startsWith('+')) {
    const internationalDigits = trimmedPhone.replace(/\D/g, '')
    return internationalDigits ? `+${internationalDigits}` : ''
  }

  let localDigits = trimmedPhone.replace(/\D/g, '')

  if (localDigits.startsWith(dialCodeDigits) && localDigits.length > dialCodeDigits.length) {
    return `+${localDigits}`
  }

  localDigits = localDigits.replace(/^0+/, '')
  return localDigits ? `+${dialCodeDigits}${localDigits}` : ''
}

const sanitizeFormData = (data: RegisterForm): RegisterForm => ({
  first_name: sanitizeName(data.first_name),
  second_name: sanitizeName(data.second_name),
  email: sanitizeEmail(data.email),
  phone_number: sanitizePhoneInput(data.phone_number),
  date_of_birth: sanitizeDate(data.date_of_birth),
  password: stripControlCharacters(data.password),
  confirmPassword: stripControlCharacters(data.confirmPassword),
  role: data.role === 'Coach' ? 'Coach' : 'Client',
})

export default function RegisterPage() {
  const router = useRouter()
  const { login: authLogin } = useAuth()
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
  const [countryCode, setCountryCode] = useState('+254')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [checking, setChecking] = useState(true)
  const [teamInviteToken, setTeamInviteToken] = useState('')
  const [apiResponse, setApiResponse] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      const params = new URLSearchParams(window.location.search)
      const inviteToken = params.get('teamInvite') || ''
      const invitedEmail = params.get('email') || ''

      if (inviteToken) {
        setTeamInviteToken(inviteToken)
      }

      if (invitedEmail) {
        setFormData(prev => ({
          ...prev,
          email: sanitizeEmail(invitedEmail)
        }))
      }

      if (isAuthenticated()) {
        // User is already logged in, redirect to homepage
        router.push(inviteToken ? '/account' : '/')
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


  const validateForm = (data: RegisterForm, normalizedPhoneNumber: string): boolean => {
    const newErrors: FormErrors = {}

    if (!data.first_name) {
      newErrors.first_name = 'First name is required'
    }

    if (!data.second_name) {
      newErrors.second_name = 'Last name is required'
    }

    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!data.phone_number) {
      newErrors.phone_number= 'Phone number is required'
    } else if (!/^\+\d{8,15}$/.test(normalizedPhoneNumber)) {
      newErrors.phone_number= 'Please enter a valid phone number'
    }

    if (!data.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!data.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && agreedToTerms
  }

  const handleInputChange = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const sanitizedValue =
      field === 'first_name' || field === 'second_name'
        ? sanitizeNameInput(value)
        : field === 'email'
        ? sanitizeEmail(value)
        : field === 'phone_number'
        ? sanitizePhoneInput(value)
        : field === 'date_of_birth'
        ? sanitizeDate(value)
        : field === 'password' || field === 'confirmPassword'
        ? stripControlCharacters(value)
        : value

    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
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

    const sanitizedData = sanitizeFormData(formData)
    const normalizedPhoneNumber = normalizePhoneNumber(sanitizedData.phone_number, countryCode)

    setFormData(sanitizedData)

    if (!validateForm(sanitizedData, normalizedPhoneNumber)) {
      return
    }

    setLoading(true)
    setApiResponse({ type: 'info', message: 'Creating your account...' })
    
    try {
      const { confirmPassword, ...userData } = {
        ...sanitizedData,
        phone_number: normalizedPhoneNumber,
        ...(teamInviteToken && { teamInviteToken }),
      }
      
      console.log('Sending registration data:', userData)
      
      const response = await authAPI.register(userData)
      
      console.log('Registration response:', response)
      
      if (response.status && response.data) {
        setApiResponse({ type: 'info', message: 'Account created. Signing you in...' })
        const loginResponse = await authAPI.login(userData.email, sanitizedData.password)

        if (!loginResponse.user || !loginResponse.token) {
          throw new Error('Account created, but automatic login failed. Please sign in manually.')
        }

        authLogin(loginResponse.user, loginResponse.token)
        setApiResponse({ type: 'success', message: 'Registration successful. You are signed in.' })
        message.success('Account created successfully!')
        
        const destination = loginResponse.user.role === 'Admin' ? '/admin' : teamInviteToken ? '/account' : '/'
        router.push(destination)
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
            <p className="text-gray-600 mt-2">
              {teamInviteToken ? 'Create your account to join your team and confirm upcoming matches' : 'Create your account and start your football journey'}
            </p>
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

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="grid grid-cols-[132px_1fr] gap-2">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(event) => setCountryCode(event.target.value)}
                    aria-label="Country code"
                    className={`
                      w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent outline-none transition-colors appearance-none bg-white cursor-pointer
                      ${errors.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                      hover:border-gray-400 focus:border-[#3A8726FF]
                    `}
                  >
                    {countryCodes.map((country) => (
                      <option key={`${country.country}-${country.code}`} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <PhoneOutlined className="text-gray-400 text-lg" />
                  </div>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="712 345 678"
                    value={formData.phone_number}
                    onChange={handleInputChange('phone_number')}
                    className={`
                      w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent outline-none transition-colors bg-white
                      ${errors.phone_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
                      hover:border-gray-400 focus:border-[#3A8726FF]
                    `}
                  />
                </div>
              </div>
              {!errors.phone_number && formData.phone_number && (
                <p className="mt-1 text-xs text-gray-500">
                  Will be saved as {normalizePhoneNumber(formData.phone_number, countryCode)}
                </p>
              )}
              {errors.phone_number && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <span>⚠️</span>
                  {errors.phone_number}
                </p>
              )}
            </div>

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
