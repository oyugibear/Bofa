'use client'

import React, { useEffect, useState } from 'react'
import { 
  PlusOutlined,
  DownloadOutlined,
  CloseOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import { UserProfile, UserType } from '@/types'
import { userAPI } from '@/utils/api'
import UserStats from '@/components/admin/Users/UserStats'
import UserTable from '@/components/admin/Users/UserTable'


// Main Users Page Component
export default function UsersPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [users, setUsers] = useState<UserType[]>([])

  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)

    // fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getAll()
      console.log("Users fetched:", response.data)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
    }
    fetchBookings()
  }, [refresh])

  const handleRefresh = () => {
    setRefresh(!refresh)
  }

  // Export users data as CSV
  const handleExportUsers = () => {
    if (users.length === 0) {
      alert('No users data to export')
      return
    }

    const csvHeaders = ['Name', 'Email', 'Phone', 'Role', 'Joined Date', 'Last Activity']
    const csvData = users.map(user => [
      `${user.first_name} ${user.second_name || ''}`.trim(),
      user.email,
      user.phone_number || 'N/A',
      user.role || 'user',
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
      user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'
    ])

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col'>
        {/* Top Header for Mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
          <h1 className="text-xl font-bold text-gray-800">Users</h1>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
          {/* Page Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Users</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage users, coaches, and administrators</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportUsers}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <DownloadOutlined /> Export
                </button>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2"
                >
                  <PlusOutlined /> Add User
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <UserStats users={users} />

          {/* Users Table */}
          <UserTable users={users} setRefresh={handleRefresh} />
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <CloseOutlined />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent">
                  <option value="user">User</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement user creation logic
                    alert('Add user functionality to be implemented')
                    setShowAddUserModal(false)
                  }}
                  className="flex-1 px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f]"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
