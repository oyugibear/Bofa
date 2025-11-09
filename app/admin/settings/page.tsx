'use client'

import React, { useState, useEffect } from 'react'
import { 
  SaveOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { Spin, message as antMessage } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import GeneralSettings from '../../../components/admin/GeneralSettings'
import FieldSettings from '../../../components/admin/FieldSettings'
import PaymentSettings from '../../../components/admin/PaymentSettings'
import NotificationSettings from '../../../components/admin/NotificationSettings'
import SecuritySettings from '../../../components/admin/SecuritySettings'
import { adminAPI } from '@/utils/api'
import { AdminSettings } from '@/types'

// Main Settings Page Component
export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [settings, setSettings] = useState<AdminSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getSettings()
      if (response.data) {
        setSettings(response.data)
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      showMessage('error', 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSectionSave = (sectionName: string, data: any) => {
    setHasChanges(true)
    setLastSaved(new Date())
    showMessage('success', `${sectionName} updated successfully`)
  }

  const handleResetSettings = async () => {
    if (!confirm('Are you sure you want to reset all settings to defaults? This action cannot be undone.')) {
      return
    }

    try {
      setSaving(true)
      await adminAPI.resetSettings()
      await loadSettings() // Reload settings after reset
      showMessage('success', 'Settings reset to defaults successfully')
    } catch (error) {
      console.error('Error resetting settings:', error)
      showMessage('error', 'Failed to reset settings')
    } finally {
      setSaving(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000) // Clear message after 5 seconds
  }

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
        <SideMenu 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className='flex-1 flex items-center justify-center'>
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Enhanced Mobile Header */}
        <div className="md:hidden bg-white shadow-lg border-b border-gray-200 p-4 pl-16 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-500">System configuration</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Main Content */}
        <div className='flex-1 p-4 md:p-8 overflow-y-auto'>
          {/* Modern Page Header */}
          <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/admin" className="hover:text-[#3A8726FF] transition-colors font-medium">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">Settings</span>
            </nav>
            
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600">Manage facility settings and preferences</p>
                  {lastSaved && (
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <CheckCircleOutlined className="text-green-500" />
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleResetSettings}
                  disabled={saving || loading}
                  className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <ReloadOutlined className={saving ? 'animate-spin' : ''} /> 
                  {saving ? 'Resetting...' : 'Reset to Defaults'}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div className={`p-4 rounded-lg flex items-center gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircleOutlined className="text-green-500" />
                ) : (
                  <ExclamationCircleOutlined className="text-red-500" />
                )}
                {message.text}
              </div>
            )}
          </div>

          {/* Settings Sections */}
          <GeneralSettings 
            onSave={(data) => handleSectionSave('General Settings', data)}
            isLoading={loading}
          />
          <FieldSettings 
            onSave={(data) => handleSectionSave('Field Settings', data)}
            isLoading={loading}
          />
          <PaymentSettings 
            onSave={(data) => handleSectionSave('Payment Settings', data)}
            isLoading={loading}
          />
          <NotificationSettings 
            onSave={(data) => handleSectionSave('Notification Settings', data)}
            isLoading={loading}
          />
          <SecuritySettings 
            onSave={(data) => handleSectionSave('Security Settings', data)}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  )
}
