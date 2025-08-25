'use client'

import React, { useState } from 'react'
import { 
  SettingOutlined,
  UserOutlined,
  LockOutlined,
  BellOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'

// Settings Form Components
const GeneralSettings = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <SettingOutlined className="text-[#3A8726FF]" />
          General Settings
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facility Name</label>
            <input 
              type="text" 
              defaultValue="Arena 03 Kilifi"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input 
              type="email" 
              defaultValue="info@arena03kilifi.com"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input 
              type="tel" 
              defaultValue="+254 712 345 678"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
            <input 
              type="text" 
              defaultValue="6:00 AM - 10:00 PM"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea 
            rows={3}
            defaultValue="Kilifi Sports Complex, Coast Province, Kenya"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
          />
        </div>
      </div>
    </div>
  )
}

const FieldSettings = () => {
  const fields = [
    { id: 1, name: 'Main Field', price: 3000, status: 'Active' },
    { id: 2, name: 'Training Pitch', price: 1500, status: 'Active' },
    { id: 3, name: 'Indoor Field', price: 2000, status: 'Active' },
    { id: 4, name: 'Practice Area', price: 1000, status: 'Maintenance' },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <EnvironmentOutlined className="text-[#3A8726FF]" />
          Field Management
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">{field.name}</h4>
                  <p className="text-sm text-gray-500">KSh {field.price.toLocaleString()}/hour</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  field.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {field.status}
                </span>
                <button className="px-3 py-1 text-sm bg-[#3A8726FF] text-white rounded hover:bg-[#2d6b1f]">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PaymentSettings = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <CreditCardOutlined className="text-[#3A8726FF]" />
          Payment Settings
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent">
              <option value="KES">Kenyan Shilling (KSh)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            <input 
              type="number" 
              defaultValue="16"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Payment Methods</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">M-Pesa</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Credit/Debit Cards</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Cash</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Bank Transfer</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const NotificationSettings = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <BellOutlined className="text-[#3A8726FF]" />
          Notification Settings
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Email Notifications</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">New bookings</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Payment confirmations</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Booking cancellations</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Daily reports</span>
            </label>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Booking reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Payment alerts</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

const SecuritySettings = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <LockOutlined className="text-[#3A8726FF]" />
          Security Settings
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
          <input 
            type="password" 
            placeholder="Enter current password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
            />
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Security Options</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Enable two-factor authentication</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Login notifications</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-[#3A8726FF]" />
              <span className="text-gray-700">Auto-logout after inactivity</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Settings Page Component
export default function SettingsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col'>
        {/* Top Header for Mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
          <h1 className="text-xl font-bold text-gray-800">Settings</h1>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
          {/* Page Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Settings</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Manage facility settings and preferences</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <ReloadOutlined /> Reset
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                  <SaveOutlined /> Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Settings Sections */}
          <GeneralSettings />
          <FieldSettings />
          <PaymentSettings />
          <NotificationSettings />
          <SecuritySettings />
        </div>
      </div>
    </div>
  )
}
