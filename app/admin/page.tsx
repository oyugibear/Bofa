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
import { message, Modal as AntModal, Spin } from 'antd'
import SideMenu from '../../components/admin/SideMenu'
import { useUser, usePermissions, RoleGuard } from '../../hooks/useUser'
import { withAuth, useAuth } from '../../contexts/AuthContext'
import { BookingDetails, Payment, UserType } from '@/types'
import { bookingAPI, paymentAPI, userAPI } from '@/utils/api'
import Stats from '@/components/admin/Stats'
import Controls from '@/components/admin/Controls'
import TodayOverview from '@/components/admin/TodayOverview'
import AlertsCenter from '@/components/admin/AlertsCenter'
import RecentActivities from '@/components/admin/RecentActivities'

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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'user'
    })

    const [bookings, setBookings] = useState<BookingDetails[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch bookings, payments, and users data
        const fetchData = async () => {
            setLoading(true)
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
                message.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            message.error('Please fill in required fields')
            return
        }

        try {
            switch (modalType) {
                case 'user':
                    // TODO: Implement user creation
                    message.success('User functionality to be implemented')
                    break
                case 'booking':
                    // TODO: Implement booking creation
                    message.success('Booking functionality to be implemented')
                    break
                case 'team':
                    // TODO: Implement team creation
                    message.success('Team functionality to be implemented')
                    break
                case 'league':
                    // TODO: Implement league creation
                    message.success('League functionality to be implemented')
                    break
                default:
                    message.error('Unknown modal type')
            }
            setShowModal(false)
            setFormData({ name: '', email: '', phone: '', role: 'user' })
        } catch (error) {
            message.error('Failed to save data')
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

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
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            </div>
            
            {/* Enhanced Main Content */}
            <div className='flex-1 p-4 md:p-8 overflow-y-auto'>
            {/* Enhanced Page Header */}
            <div className="mb-8">
                {/* Breadcrumb */}
                <nav className="hidden md:flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span className="text-gray-900 font-semibold">Dashboard</span>
                </nav>
                
                {/* Desktop Header */}
                <div className="hidden md:flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
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
            </div>

            <Stats data={{ bookings, payments, users }} />
            
            {/* Today's Overview and Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TodayOverview data={{ bookings, payments, users }} />
              <AlertsCenter data={{ bookings, payments, users }} />
            </div>
            
            <Controls setShowModal={setShowModal} setModalType={setModalType} />
            <RecentActivities data={{ bookings, payments, users }} />
            </div>
        </div>

        {/* Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} type={modalType}>
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
                    placeholder="Enter name"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
                    placeholder="Enter email"
                />
            </div>
            {modalType === 'user' && (
                <>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent" 
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select 
                            value={formData.role}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                        >
                            <option value="user">User</option>
                            <option value="coach">Coach</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </>
            )}
            <div className="flex gap-3 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
                </button>
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f]">
                Save
                </button>
            </div>
            </div>
        </Modal>
        </div>
    )
}

