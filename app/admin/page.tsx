'use client'

import React, { useState, useEffect } from 'react'
import { 
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  DollarOutlined,
  PlusOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  BellOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { message, Modal as AntModal } from 'antd'
import SideMenu from '../../components/admin/SideMenu'
import { useUser, usePermissions, RoleGuard } from '../../hooks/useUser'
import { withAuth, useAuth } from '../../contexts/AuthContext'
import { Booking, Payment } from '@/types'
import { User } from '@/services/users'
import { bookingAPI, paymentAPI, userAPI } from '@/utils/api'
import Stats from '@/components/admin/Stats'
import Controls from '@/components/admin/Controls'



// Recent Activities Component
const RecentActivities = () => {
  const activities = [
    { user: 'John Doe', action: 'booked Main Field', time: '2 hours ago', type: 'booking' },
    { user: 'Jane Smith', action: 'joined Champions League', time: '4 hours ago', type: 'league' },
    { user: 'Mike Johnson', action: 'completed payment', time: '6 hours ago', type: 'payment' },
    { user: 'Sarah Wilson', action: 'created new team', time: '1 day ago', type: 'team' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <CalendarOutlined className="text-blue-600" />
      case 'league': return <TrophyOutlined className="text-orange-600" />
      case 'payment': return <DollarOutlined className="text-green-600" />
      case 'team': return <TeamOutlined className="text-purple-600" />
      default: return <BellOutlined />
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="text-xl">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-gray-900 text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}
              </p>
              <p className="text-gray-500 text-xs">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Modal Component
const Modal = ({ isOpen, onClose, type, children }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 capitalize">Add New {type}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <CloseOutlined />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

// Main Admin Page Component
export default function AdminPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')
    const { user, fullName, isAdmin } = useUser()
    const { logout } = useAuth()

    const [bookings, setBookings] = useState<Booking[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        // Fetch bookings, payments, and users data
        const fetchData = async () => {
            try {

                const [bookingsData, paymentsData, usersData] = await Promise.all([
                    bookingAPI.getAll(),
                    paymentAPI.getAll(),
                    userAPI.getAll()
                ])
                setBookings(bookingsData.data)
                setPayments(paymentsData.data)
                setUsers(usersData.data)

                console.log('Bookings:', bookingsData)
                console.log('Payments:', paymentsData)
                console.log('Users:', usersData)

            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleLogout = () => {
        AntModal.confirm({
        title: 'Confirm Logout',
        content: 'Are you sure you want to logout?',
        onOk: () => {
            logout()
            message.success('Logged out successfully')
        }
        })
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
        <SideMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className='flex-1 flex flex-col'>
            {/* Top Header for Mobile */}
            <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16 flex items-center justify-between">
            <div>
                <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.first_name}!</p>
            </div>
            <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
            >
                <LogoutOutlined />
            </button>
            </div>
            
            {/* Main Content */}
            <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
            {/* Desktop Title */}
            <div className="hidden md:flex justify-between items-center mb-6">
                <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {fullName}! Manage your Arena 03 facility</p>
                </div>
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                <LogoutOutlined />
                <span>Logout</span>
                </button>
            </div>

            <Stats data={{ bookings, payments, users }} />
            <Controls setShowModal={setShowModal} setModalType={setModalType} />
            <RecentActivities />
            </div>
        </div>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} type={modalType}>
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" />
            </div>
            <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f]">
                Save
                </button>
            </div>
            </div>
        </Modal>
        </div>
    )
}

