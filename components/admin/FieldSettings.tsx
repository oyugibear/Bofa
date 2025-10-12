import React, { useState, useEffect } from 'react'
import { EnvironmentOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons'
import { adminAPI } from '@/utils/api'
import { FieldSettingsData } from '@/types'

interface FieldSettingsProps {
  onSave?: (data: FieldSettingsData) => void
  isLoading?: boolean
}

const FieldSettings: React.FC<FieldSettingsProps> = ({ onSave, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState<FieldSettingsData>({
    defaultBookingDuration: 1,
    maxAdvanceBookingDays: 30,
    minAdvanceBookingHours: 2,
    allowOverbooking: false,
    maintenanceMode: false,
    defaultFieldStatus: 'active'
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
      const response = await adminAPI.getFieldSettings()
      if (response.data && response.data.fieldSettings) {
        setFormData(response.data.fieldSettings)
      }
    } catch (error) {
      console.error('Error loading field settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.defaultBookingDuration <= 0) {
      newErrors.defaultBookingDuration = 'Default booking duration must be greater than 0'
    }

    if (formData.maxAdvanceBookingDays <= 0) {
      newErrors.maxAdvanceBookingDays = 'Max advance booking days must be greater than 0'
    }

    if (formData.minAdvanceBookingHours < 0) {
      newErrors.minAdvanceBookingHours = 'Min advance booking hours cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FieldSettingsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      await adminAPI.updateFieldSettings(formData)
      
      if (onSave) {
        onSave(formData)
      }
    } catch (error) {
      console.error('Error saving field settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <EnvironmentOutlined className="text-[#3A8726FF]" />
            Field Management Settings
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
          <EnvironmentOutlined className="text-[#3A8726FF]" />
          Field Management Settings
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
              Default Booking Duration (hours) *
            </label>
            <input 
              type="number" 
              min="0.5"
              step="0.5"
              value={formData.defaultBookingDuration}
              onChange={(e) => handleInputChange('defaultBookingDuration', parseFloat(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.defaultBookingDuration ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.defaultBookingDuration && (
              <p className="text-red-500 text-sm mt-1">{errors.defaultBookingDuration}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Advance Booking Days *
            </label>
            <input 
              type="number" 
              min="1"
              value={formData.maxAdvanceBookingDays}
              onChange={(e) => handleInputChange('maxAdvanceBookingDays', parseInt(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.maxAdvanceBookingDays ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.maxAdvanceBookingDays && (
              <p className="text-red-500 text-sm mt-1">{errors.maxAdvanceBookingDays}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Advance Booking Hours *
            </label>
            <input 
              type="number" 
              min="0"
              value={formData.minAdvanceBookingHours}
              onChange={(e) => handleInputChange('minAdvanceBookingHours', parseInt(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.minAdvanceBookingHours ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.minAdvanceBookingHours && (
              <p className="text-red-500 text-sm mt-1">{errors.minAdvanceBookingHours}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Field Status
            </label>
            <select 
              value={formData.defaultFieldStatus}
              onChange={(e) => handleInputChange('defaultFieldStatus', e.target.value as 'active' | 'maintenance' | 'inactive')}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Field Management Options</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.allowOverbooking}
                onChange={(e) => handleInputChange('allowOverbooking', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Allow Overbooking</span>
                <p className="text-sm text-gray-500">Allow bookings beyond normal field capacity</p>
              </div>
            </label>
            
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.maintenanceMode}
                onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Global Maintenance Mode</span>
                <p className="text-sm text-gray-500">Temporarily disable all field bookings</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FieldSettings
