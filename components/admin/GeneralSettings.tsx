import React, { useState, useEffect } from 'react'
import { SettingOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons'
import { adminAPI } from '@/utils/api'
import { GeneralSettings as GeneralSettingsType } from '@/types'

interface GeneralSettingsProps {
  onSave?: (data: GeneralSettingsType) => void
  isLoading?: boolean
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onSave, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState<GeneralSettingsType>({
    facilityName: '',
    contactEmail: '',
    phoneNumber: '',
    operatingHours: '',
    address: '',
    timezone: 'Africa/Nairobi',
    language: 'en'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getGeneralSettings()
      if (response.data && response.data.generalSettings) {
        setFormData(response.data.generalSettings)
      }
    } catch (error) {
      console.error('Error loading general settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.facilityName.trim()) {
      newErrors.facilityName = 'Facility name is required'
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    if (!formData.operatingHours.trim()) {
      newErrors.operatingHours = 'Operating hours are required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof GeneralSettingsType, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      await adminAPI.updateGeneralSettings(formData)
      
      if (onSave) {
        onSave(formData)
      }
    } catch (error) {
      console.error('Error saving general settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <SettingOutlined className="text-[#3A8726FF]" />
            General Settings
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
          <SettingOutlined className="text-[#3A8726FF]" />
          General Settings
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facility Name *
            </label>
            <input 
              type="text" 
              value={formData.facilityName}
              onChange={(e) => handleInputChange('facilityName', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.facilityName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter facility name"
            />
            {errors.facilityName && (
              <p className="text-red-500 text-sm mt-1">{errors.facilityName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input 
              type="email" 
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.contactEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter contact email"
            />
            {errors.contactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input 
              type="tel" 
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operating Hours *
            </label>
            <input 
              type="text" 
              value={formData.operatingHours}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.operatingHours ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., 6:00 AM - 10:00 PM"
            />
            {errors.operatingHours && (
              <p className="text-red-500 text-sm mt-1">{errors.operatingHours}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <textarea 
            rows={3}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter full address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings
