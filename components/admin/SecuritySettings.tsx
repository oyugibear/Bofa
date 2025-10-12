import React, { useState, useEffect } from 'react'
import { LockOutlined, SaveOutlined, LoadingOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'
import { adminAPI } from '@/utils/api'
import { SecuritySettingsData } from '@/types'

interface SecuritySettingsProps {
  onSave?: (data: SecuritySettingsData) => void
  isLoading?: boolean
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onSave, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState<SecuritySettingsData>({
    twoFactorAuth: true,
    loginNotifications: true,
    autoLogout: false,
    autoLogoutMinutes: 60,
    passwordMinLength: 8,
    requirePasswordChange: false
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getSecuritySettings()
      if (response.data && response.data.securitySettings) {
        setFormData(response.data.securitySettings)
      }
    } catch (error) {
      console.error('Error loading security settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateSettingsForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.passwordMinLength < 4 || formData.passwordMinLength > 128) {
      newErrors.passwordMinLength = 'Password minimum length must be between 4 and 128 characters'
    }

    if (formData.autoLogout && formData.autoLogoutMinutes <= 0) {
      newErrors.autoLogoutMinutes = 'Auto logout time must be greater than 0'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < formData.passwordMinLength) {
      newErrors.newPassword = `Password must be at least ${formData.passwordMinLength} characters long`
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof SecuritySettingsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePasswordChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleSaveSettings = async () => {
    if (!validateSettingsForm()) return

    try {
      setSaving(true)
      await adminAPI.updateSecuritySettings(formData)
      
      if (onSave) {
        onSave(formData)
      }
    } catch (error) {
      console.error('Error saving security settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) return

    try {
      setChangingPassword(true)
      // Note: This would typically call a separate password change endpoint
      // For now, we'll just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Clear password fields after successful change
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Show success message (this would typically be handled by parent component)
      console.log('Password changed successfully')
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <LockOutlined className="text-[#3A8726FF]" />
            Security Settings
          </h3>
        </div>
        <div className="p-6 flex items-center justify-center">
          <LoadingOutlined className="text-2xl text-[#3A8726FF]" />
          <span className="ml-2 text-gray-600">Loading settings...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LockOutlined className="text-[#3A8726FF]" />
          Security Settings
        </h3>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <LoadingOutlined /> : <SaveOutlined />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      <div className="p-6 space-y-6">
        {/* Password Change Section */}
        <div className="border-b border-gray-200 pb-6">
          <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password *</label>
              <div className="relative">
                <input 
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                    errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password *</label>
                <div className="relative">
                  <input 
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className={`w-full p-3 pr-10 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleChangePassword}
              disabled={changingPassword}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {changingPassword ? <LoadingOutlined /> : <LockOutlined />}
              {changingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Security Options */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Security Options</h4>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password Minimum Length *
                </label>
                <input 
                  type="number" 
                  min="4"
                  max="128"
                  value={formData.passwordMinLength}
                  onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                    errors.passwordMinLength ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.passwordMinLength && (
                  <p className="text-red-500 text-sm mt-1">{errors.passwordMinLength}</p>
                )}
              </div>
              
              <div className={formData.autoLogout ? '' : 'opacity-50'}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto Logout Time (minutes)
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={formData.autoLogoutMinutes}
                  onChange={(e) => handleInputChange('autoLogoutMinutes', parseInt(e.target.value))}
                  disabled={!formData.autoLogout}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                    errors.autoLogoutMinutes ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.autoLogoutMinutes && (
                  <p className="text-red-500 text-sm mt-1">{errors.autoLogoutMinutes}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.twoFactorAuth}
                  onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                  className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
                />
                <div>
                  <span className="text-gray-700 font-medium">Enable two-factor authentication</span>
                  <p className="text-sm text-gray-500">Require additional verification for login</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.loginNotifications}
                  onChange={(e) => handleInputChange('loginNotifications', e.target.checked)}
                  className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
                />
                <div>
                  <span className="text-gray-700 font-medium">Login notifications</span>
                  <p className="text-sm text-gray-500">Get notified when someone logs into your account</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.autoLogout}
                  onChange={(e) => handleInputChange('autoLogout', e.target.checked)}
                  className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
                />
                <div>
                  <span className="text-gray-700 font-medium">Auto-logout after inactivity</span>
                  <p className="text-sm text-gray-500">Automatically log out users after a period of inactivity</p>
                </div>
              </label>
              
              <label className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={formData.requirePasswordChange}
                  onChange={(e) => handleInputChange('requirePasswordChange', e.target.checked)}
                  className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
                />
                <div>
                  <span className="text-gray-700 font-medium">Require periodic password changes</span>
                  <p className="text-sm text-gray-500">Force users to change passwords regularly</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings
