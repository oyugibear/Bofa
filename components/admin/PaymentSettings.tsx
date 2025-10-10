import React, { useState, useEffect } from 'react'
import { CreditCardOutlined, SaveOutlined, LoadingOutlined } from '@ant-design/icons'
import { adminAPI } from '@/utils/api'
import { PaymentSettingsData } from '@/types'

interface PaymentSettingsProps {
  onSave?: (data: PaymentSettingsData) => void
  isLoading?: boolean
}

const PaymentSettings: React.FC<PaymentSettingsProps> = ({ onSave, isLoading: externalLoading }) => {
  const [formData, setFormData] = useState<PaymentSettingsData>({
    currency: 'KES',
    taxRate: 16,
    paymentMethods: {
      mpesa: true,
      cards: true,
      cash: true,
      bankTransfer: false
    },
    autoPaymentConfirmation: true,
    paymentTimeout: 30
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
      const response = await adminAPI.getPaymentSettings()
      if (response.data && response.data.paymentSettings) {
        setFormData(response.data.paymentSettings)
      }
    } catch (error) {
      console.error('Error loading payment settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'Tax rate must be between 0 and 100'
    }

    if (formData.paymentTimeout <= 0) {
      newErrors.paymentTimeout = 'Payment timeout must be greater than 0'
    }

    // Check if at least one payment method is enabled
    const hasPaymentMethod = Object.values(formData.paymentMethods).some(method => method === true)
    if (!hasPaymentMethod) {
      newErrors.paymentMethods = 'At least one payment method must be enabled'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof PaymentSettingsData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePaymentMethodChange = (method: keyof PaymentSettingsData['paymentMethods'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: value
      }
    }))
    if (errors.paymentMethods) {
      setErrors(prev => ({ ...prev, paymentMethods: '' }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      await adminAPI.updatePaymentSettings(formData)
      
      if (onSave) {
        onSave(formData)
      }
    } catch (error) {
      console.error('Error saving payment settings:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading || externalLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <CreditCardOutlined className="text-[#3A8726FF]" />
            Payment Settings
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
          <CreditCardOutlined className="text-[#3A8726FF]" />
          Payment Settings
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
            <select 
              value={formData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
            >
              <option value="KES">Kenyan Shilling (KSh)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
              <option value="GBP">British Pound (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%) *</label>
            <input 
              type="number" 
              min="0"
              max="100"
              step="0.1"
              value={formData.taxRate}
              onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.taxRate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.taxRate && (
              <p className="text-red-500 text-sm mt-1">{errors.taxRate}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Timeout (minutes) *</label>
            <input 
              type="number" 
              min="1"
              value={formData.paymentTimeout}
              onChange={(e) => handleInputChange('paymentTimeout', parseInt(e.target.value))}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent ${
                errors.paymentTimeout ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.paymentTimeout && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentTimeout}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Payment Methods *</h4>
          {errors.paymentMethods && (
            <p className="text-red-500 text-sm">{errors.paymentMethods}</p>
          )}
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.paymentMethods.mpesa}
                onChange={(e) => handlePaymentMethodChange('mpesa', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">M-Pesa</span>
                <p className="text-sm text-gray-500">Mobile money payments via Safaricom M-Pesa</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.paymentMethods.cards}
                onChange={(e) => handlePaymentMethodChange('cards', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Credit/Debit Cards</span>
                <p className="text-sm text-gray-500">Visa, Mastercard, and other card payments</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.paymentMethods.cash}
                onChange={(e) => handlePaymentMethodChange('cash', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Cash</span>
                <p className="text-sm text-gray-500">Cash payments at the facility</p>
              </div>
            </label>
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.paymentMethods.bankTransfer}
                onChange={(e) => handlePaymentMethodChange('bankTransfer', e.target.checked)}
                className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
              />
              <div>
                <span className="text-gray-700 font-medium">Bank Transfer</span>
                <p className="text-sm text-gray-500">Direct bank transfers</p>
              </div>
            </label>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Payment Options</h4>
          <label className="flex items-center gap-3">
            <input 
              type="checkbox" 
              checked={formData.autoPaymentConfirmation}
              onChange={(e) => handleInputChange('autoPaymentConfirmation', e.target.checked)}
              className="rounded text-[#3A8726FF] focus:ring-[#3A8726FF]" 
            />
            <div>
              <span className="text-gray-700 font-medium">Auto Payment Confirmation</span>
              <p className="text-sm text-gray-500">Automatically confirm bookings when payment is received</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  )
}

export default PaymentSettings
