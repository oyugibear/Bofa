import React, { useState, useEffect } from 'react'
import { BellOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons'
import { adminAPI } from '@/utils/api'
import { NotificationSettingsData } from '@/types'

interface NotificationSettingsProps {
  onSave?: (data: NotificationSettingsData) => void
  isLoading?: boolean
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onSave, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState<NotificationSettingsData>({
    emailNotifications: {
      newBookings: true,
      paymentConfirmations: true,
      bookingCancellations: false,
      dailyReports: true
    },
    smsNotifications: {
      bookingReminders: true,
      paymentAlerts: false
    },
    notificationEmail: 'admin@arena03kilifi.com'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getNotificationSettings()
      if (response.data && response.data.notificationSettings) {
        setFormData(response.data.notificationSettings)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.notificationEmail.trim()) {
      newErrors.notificationEmail = 'Notification email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.notificationEmail)) {
      newErrors.notificationEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailNotificationChange = (field: keyof NotificationSettingsData['emailNotifications'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      emailNotifications: {
        ...prev.emailNotifications,
        [field]: value
      }
    }))
  }

  const handleSmsNotificationChange = (field: keyof NotificationSettingsData['smsNotifications'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      smsNotifications: {
        ...prev.smsNotifications,
        [field]: value
      }
    }))
  }

  const handleNotificationEmailChange = (value: string) => {
    setFormData(prev => ({ ...prev, notificationEmail: value }))
    if (errors.notificationEmail) {
      setErrors(prev => ({ ...prev, notificationEmail: '' }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      await adminAPI.updateNotificationSettings(formData)
      
      if (onSave) {
        onSave(formData)
      }
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <BellOutlined className="text-[#3A8726FF]" />
            Notification Settings
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
          <BellOutlined className="text-[#3A8726FF]" />
          Notification Settings
        </h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <LoadingOutlined /> : <SaveOutlined />}
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Email Address *
          </label>
          <input 
            type="email" 
            value={formData.notificationEmail}
            onChange={(e) => handleNotificationEmailChange(e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
              errors.notificationEmail ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter notification email"
          />
          {errors.notificationEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.notificationEmail}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">This email will receive all admin notifications</p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Email Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.emailNotifications.newBookings}
                onChange={(e) => handleEmailNotificationChange('newBookings', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">New bookings</span>
                <p className="text-sm text-gray-500">Get notified when customers make new bookings</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.emailNotifications.paymentConfirmations}
                onChange={(e) => handleEmailNotificationChange('paymentConfirmations', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Payment confirmations</span>
                <p className="text-sm text-gray-500">Get notified when payments are received</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.emailNotifications.bookingCancellations}
                onChange={(e) => handleEmailNotificationChange('bookingCancellations', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Booking cancellations</span>
                <p className="text-sm text-gray-500">Get notified when bookings are cancelled</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.emailNotifications.dailyReports}
                onChange={(e) => handleEmailNotificationChange('dailyReports', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Daily reports</span>
                <p className="text-sm text-gray-500">Receive daily summary of bookings and revenue</p>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.smsNotifications.bookingReminders}
                onChange={(e) => handleSmsNotificationChange('bookingReminders', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Booking reminders</span>
                <p className="text-sm text-gray-500">Send SMS reminders to customers before their booking</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.smsNotifications.paymentAlerts}
                onChange={(e) => handleSmsNotificationChange('paymentAlerts', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Payment alerts</span>
                <p className="text-sm text-gray-500">Send SMS notifications for payment status updates</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationSettings
