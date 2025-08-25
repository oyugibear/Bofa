'use client'

import React, { useEffect, useState } from 'react'
import { 
  PlusOutlined,
  DownloadOutlined
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

  // fetch bookings data
  useEffect(() => {
    const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getAll()
      console.log("Users fetched:", response.data)
      setUsers(response.data as UserType[])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
    }

    fetchBookings()
  }, [refresh])

  // Wrapper function for setRefresh to match expected signature
  const handleRefresh = () => {
    setRefresh(prev => !prev)
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
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <DownloadOutlined /> Export
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
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
    </div>
  )
}
