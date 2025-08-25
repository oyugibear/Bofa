'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { MailOutlined, LockOutlined, CheckCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { FormInput, FormButton } from '../../../components/constants'
import { authAPI } from '../../../lib/auth'
import { isAuthenticated } from '../../../lib/utils'

interface ForgotPasswordForm {
  email: string
}

interface ResetPasswordForm {
  code: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  code?: string
  newPassword?: string
  confirmPassword?: string
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email')
  const [emailData, setEmailData] = useState<ForgotPasswordForm>({ email: '' })
  const [resetData, setResetData] = useState<ResetPasswordForm>({
    code: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

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

  const validateEmailForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!emailData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(emailData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateResetForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!resetData.code) {
      newErrors.code = 'Verification code is required'
    } else if (resetData.code.length !== 6) {
      newErrors.code = 'Verification code must be 6 digits'
    }

    if (!resetData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (resetData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long'
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (resetData.newPassword !== resetData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailData({ email: e.target.value })
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }))
    }
  }

  const handleResetInputChange = (field: keyof ResetPasswordForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setResetData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmailForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(emailData.email)
      
      if (response.status) {
        message.success('Reset code sent to your email!')
        setStep('code')
      }
    } catch (error) {
      console.error('Reset email error:', error)
      message.error(error instanceof Error ? error.message : 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateResetForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await authAPI.resetPassword(
        emailData.email, 
        resetData.code, 
        resetData.newPassword
      )
      
      if (response.status) {
        message.success('Password reset successfully!')
        setStep('success')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      message.error(error instanceof Error ? error.message : 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    try {
      const response = await authAPI.forgotPassword(emailData.email)
      
      if (response.status) {
        message.success('New verification code sent!')
      }
    } catch (error) {
      console.error('Resend code error:', error)
      message.error(error instanceof Error ? error.message : 'Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'success' ? (
                <CheckCircleOutlined className="text-white text-3xl" />
              ) : (
                <LockOutlined className="text-white text-3xl" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              {step === 'email' && 'Reset Password'}
              {step === 'code' && 'Enter Reset Code'}
              {step === 'success' && 'Password Reset!'}
            </h1>
            <p className="text-gray-600 mt-2">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'code' && 'Enter the 6-digit code sent to your email'}
              {step === 'success' && 'Your password has been successfully reset'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === 'email' && (
            <>
              <form onSubmit={handleSendResetEmail} className="space-y-6">
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  value={emailData.email}
                  onChange={handleEmailChange}
                  error={errors.email}
                  required
                  icon={<MailOutlined className="text-gray-400" />}
                />

                <FormButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="mt-6"
                >
                  {loading ? 'Sending Reset Code...' : 'Send Reset Code'}
                </FormButton>
              </form>

              <div className="mt-6 text-center">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center text-sm font-medium text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors"
                >
                  <ArrowLeftOutlined className="mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  We've sent a 6-digit verification code to <strong>{emailData.email}</strong>
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <FormInput
                  label="Verification Code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={resetData.code}
                  onChange={handleResetInputChange('code')}
                  error={errors.code}
                  required
                  className="text-center"
                />

                <FormInput
                  label="New Password"
                  type="password"
                  placeholder="Enter your new password"
                  value={resetData.newPassword}
                  onChange={handleResetInputChange('newPassword')}
                  error={errors.newPassword}
                  required
                  icon={<LockOutlined className="text-gray-400" />}
                />

                <FormInput
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm your new password"
                  value={resetData.confirmPassword}
                  onChange={handleResetInputChange('confirmPassword')}
                  error={errors.confirmPassword}
                  required
                  icon={<LockOutlined className="text-gray-400" />}
                />

                <FormButton
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="mt-6"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </FormButton>
              </form>

              <div className="mt-6 text-center space-y-2">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm font-medium text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors disabled:opacity-50"
                >
                  Didn't receive the code? Resend
                </button>
                <div>
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeftOutlined className="mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircleOutlined className="text-green-600 text-4xl mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Password Reset Complete!
                </h3>
                <p className="text-green-700 text-sm">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
              </div>

              <FormButton
                type="primary"
                block
                onClick={() => window.location.href = '/auth/login'}
              >
                Sign In Now
              </FormButton>

              <div className="text-center">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
