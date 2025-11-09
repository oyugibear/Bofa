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
      
      <div className='flex-1 flex flex-col min-h-screen bg-gray-50'>
        {/* Enhanced Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="p-4 pl-16">
            <h1 className="text-xl font-bold text-gray-800">Users</h1>
            <p className="text-sm text-gray-600 mt-1">{users.length} total users</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-3 md:p-6 overflow-x-hidden'>
          {/* Mobile-Optimized Page Header */}
          <div className="mb-4 md:mb-6">
            <nav className="hidden md:flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Users</span>
            </nav>
            
            {/* Desktop Header */}
            <div className="hidden md:flex md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600 mt-1">Manage users, coaches, and administrators</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleExportUsers}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                  <DownloadOutlined /> Export
                </button>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2 transition-colors"
                >
                  <PlusOutlined /> Add User
                </button>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden">
              <h1 className="text-xl font-bold text-gray-900 mb-3">User Management</h1>
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleExportUsers}
                  className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <DownloadOutlined /> Export
                </button>
                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="flex-1 px-4 py-3 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center justify-center gap-2 transition-colors font-medium"
                >
                  <PlusOutlined /> Add User
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <UserStats users={users} />

          {/* Users Table */}
          <div className="w-full">
            <UserTable users={users} setRefresh={handleRefresh} />
          </div>
        </div>
      </div>

      {/* Enhanced Mobile-Friendly Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl md:rounded-lg shadow-xl w-full max-w-md mx-0 md:mx-4 max-h-[90vh] md:max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b bg-gray-50">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="p-4 md:p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-none">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent text-base"
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent text-base"
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent text-base"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent text-base"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent text-base bg-white">
                  <option value="user">User</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="sticky bottom-0 bg-white border-t p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-3">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 px-6 py-4 md:py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement user creation logic
                    alert('Add user functionality to be implemented')
                    setShowAddUserModal(false)
                  }}
                  className="flex-1 px-6 py-4 md:py-3 bg-[#3A8726FF] text-white rounded-xl hover:bg-[#2d6b1f] transition-colors font-medium text-base"
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
