'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, Tabs, Badge, Avatar, Button, Table, Tag, Modal, Rate, Input, message } from 'antd'
import { 
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  HistoryOutlined,
  CloseCircleOutlined,
  StarOutlined,
  FileTextOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  SettingOutlined,
  LogoutOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../hooks/useUser'
import { Activity, Booking, UserProfile, Payment } from '@/types'
import { bookingAPI, paymentAPI, userAPI } from '@/utils/api'
import { generateReceiptPDF } from '@/utils/receiptGenerator'
import StatsCards from '@/components/constants/Cards/StatsCards'

const { TabPane } = Tabs
const { TextArea } = Input

export default function AccountPage() {
  const { logout } = useAuth()
  const { user: currentUser, isAuthenticated, fullName, email, phone, memberSince, updateUser } = useUser()
  
  // Refresh data function
  const refreshData = async () => {
    if (!currentUser?._id) return
    
    setDataLoading(true)
    try {
      await loadBookings()
      await loadPayments()
      message.success('Account data refreshed')
    } catch (error) {
      console.error('Error refreshing data:', error)
      message.error('Failed to refresh data')
    } finally {
      setDataLoading(false)
    }
  }
  
  // State management
  const [activeTab, setActiveTab] = useState('bookings')
  const [editProfileModal, setEditProfileModal] = useState(false)
  const [reviewModal, setReviewModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  
  // Data states
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [userStats, setUserStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteField: 'Main Field'
  })
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: ''
  })
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  
  // Settings states
  const [notifications, setNotifications] = useState({
    emailBookings: true,
    smsReminders: true,
    marketing: false
  })
  
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showActivity: false,
    twoFactor: true
  })

  // Load data from API
  useEffect(() => {
    const loadAllData = async () => {
      if (!currentUser?._id) return
      
      setDataLoading(true)
      try {
        await loadBookings()
        await loadPayments()
      } catch (error) {
        console.error('Error loading user data:', error)
        message.error('Failed to load account data')
      } finally {
        setDataLoading(false)
      }
    }

    if (currentUser?._id) {
      loadAllData()
    }
  }, [currentUser?._id])

  // Generate activities when bookings or payments change
  useEffect(() => {
    if (bookings.length > 0 || payments.length > 0) {
      loadActivities()
    }
  }, [bookings, payments])

  // API loading functions
  const loadBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(currentUser?._id || '')
      console.log("Bookings response:", response)
      if (response.data) {
        // Transform API data to match our Booking interface
        const transformedBookings = response.data.map((booking: any) => ({
          id: booking._id,
          fieldName: booking.field?.name || 'Unknown Field',
          date: booking.date_requested,
          time: booking.time,
          duration: booking.duration,
          amount: booking.total_price,
          status: booking.status || 'pending',
          paymentStatus: booking.payment_status || 'pending',
          bookingType: booking.booking_type || 'casual'
        }))
        setBookings(transformedBookings)
      }
    } catch (error) {
      console.error('Error loading bookings:', error)
    }
  }

  const loadPayments = async () => {
    try {
      const response = await paymentAPI.getUserPayments(currentUser?._id || '')
      console.log("Payments response***:", response.data)
      if (response.data) {
        setPayments(response.data)
      }
    } catch (error) {
      console.error('Error loading payments:', error)
    }
  }

  const loadActivities = async () => {
    try {
      // Generate activities from bookings and payments
      const activities: Activity[] = []
      
      // Add booking activities
      bookings.forEach(booking => {
        activities.push({
          id: `booking_${booking.id}`,
          type: 'booking',
          description: `Booked ${booking.fieldName} for ${booking.bookingType} session`,
          date: new Date(booking.date).toISOString(),
          status: booking.status === 'confirmed' || booking.status === 'completed' ? 'success' : 
                  booking.status === 'cancelled' ? 'failed' : 'pending',
          amount: booking.amount
        })
      })

      // Add payment activities
      payments.forEach(payment => {
        activities.push({
          id: `payment_${payment._id}`,
          type: 'payment',
          description: `Payment ${payment.payment_status || 'processed'} for booking`,
          date: payment.createdAt,
          status: payment.payment_status === 'Completed' ? 'success' : 
                  payment.payment_status === 'Failed' ? 'failed' : 'pending',
          amount: payment.final_amount_invoiced || payment.amountPaid || payment.amount
        })
      })

      // Sort by date (newest first)
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setActivities(activities)
    } catch (error) {
      console.error('Error generating activities:', error)
    }
  }

  // Create user profile from authenticated user data
  const userProfile: UserProfile = {
    id: currentUser?._id || '',
    name: currentUser ? `${currentUser.first_name} ${currentUser.second_name}` : '',
    email: currentUser?.email || '',
    phone: currentUser?.phone_number || '',
    memberSince: currentUser?.createdAt || '',
    totalBookings: userStats.totalBookings,
    totalSpent: userStats.totalSpent,
    favoriteField: userStats.favoriteField
  }

  // Effects
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/auth/login'
    }
  }, [isAuthenticated])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        name: `${currentUser.first_name} ${currentUser.second_name}`,
        email: currentUser.email,
        phone: currentUser.phone_number,
        dateOfBirth: currentUser.date_of_birth || ''
      })
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser && bookings.length > 0) {
      calculateUserStatistics()
    }
  }, [currentUser, bookings])

  // Load saved preferences from localStorage
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notification_preferences')
      const savedPrivacy = localStorage.getItem('privacy_settings')
      
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications))
      }
      
      if (savedPrivacy) {
        setPrivacy(JSON.parse(savedPrivacy))
      }
    } catch (error) {
      console.error('Error loading saved preferences:', error)
    }
  }, [])

  // Calculate user statistics from real data
  const calculateUserStatistics = () => {
    try {
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed')
      const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.amount, 0)
      
      const fieldCounts = bookings.reduce((acc, booking) => {
        acc[booking.fieldName] = (acc[booking.fieldName] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const favoriteField = Object.entries(fieldCounts).length > 0 
        ? Object.entries(fieldCounts).reduce((a, b) => 
            fieldCounts[a[0]] > fieldCounts[b[0]] ? a : b
          )?.[0] || 'Main Field'
        : 'Main Field'
      
      setUserStats({
        totalBookings: confirmedBookings.length,
        totalSpent: totalSpent,
        favoriteField: favoriteField
      })
    } catch (error) {
      console.error('Error calculating statistics:', error)
    }
  }

  const updateProfile = async () => {
    setProfileLoading(true)
    try {
      if (!profileForm.name.trim() || !profileForm.email.trim() || !profileForm.phone.trim()) {
        message.error('Please fill in all required fields')
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileForm.email)) {
        message.error('Please enter a valid email address')
        return
      }

      const phoneRegex = /^[0-9+\-\s()]+$/
      if (!phoneRegex.test(profileForm.phone)) {
        message.error('Please enter a valid phone number')
        return
      }
      
      const nameParts = profileForm.name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ')
      
      // Update via API
      const updateData = {
        first_name: firstName,
        second_name: lastName,
        email: profileForm.email,
        phone_number: profileForm.phone,
        date_of_birth: profileForm.dateOfBirth
      }
      
      const response = await userAPI.update(currentUser?._id || '', updateData)
      
      if (response.success) {
        // Update local user context
        updateUser(updateData)

        // Add activity record
        const newActivity: Activity = {
          id: `ACT${Date.now()}`,
          type: 'profile_update',
          description: 'Updated profile information',
          date: new Date().toISOString(),
          status: 'success'
        }
        
        setActivities(prev => [newActivity, ...prev])
        setEditProfileModal(false)
        message.success('Profile updated successfully!')
      } else {
        message.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      message.error('Failed to update profile. Please try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  const submitReview = async () => {
    if (!selectedBooking) return
    
    setReviewLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newActivity: Activity = {
        id: `ACT${Date.now()}`,
        type: 'review',
        description: `Left ${reviewForm.rating}-star review for ${selectedBooking.fieldName}`,
        date: new Date().toISOString(),
        status: 'success'
      }
      
      setActivities(prev => [newActivity, ...prev])
      message.success('Review submitted successfully!')
      setReviewModal(false)
      setSelectedBooking(null)
    } catch (error) {
      message.error('Failed to submit review. Please try again.')
    } finally {
      setReviewLoading(false)
    }
  }


  const downloadReceipt = (paymentId: string) => {
    try {
      // Find the payment
      const payment = payments.find(p => p._id === paymentId)
      if (!payment) {
        message.error('Payment not found')
        return
      }

      // Generate PDF receipt using utility function
      generateReceiptPDF(payment)
      message.success('Receipt generated successfully! Check your browser\'s print dialog.')
      
    } catch (error) {
      console.error('Download receipt error:', error)
      message.error('Failed to generate receipt. Please try again.')
    }
  }

  const changePassword = () => {
    Modal.confirm({
      title: 'Change Password',
      content: 'You will be redirected to change your password. Continue?',
      onOk: () => {
        message.info('Redirecting to change password page...')
      }
    })
  }

  const deleteAccount = () => {
    Modal.confirm({
      title: 'Delete Account',
      content: 'Are you sure you want to delete your account? This action cannot be undone and you will lose all your data.',
      okText: 'Yes, Delete My Account',
      okType: 'danger',
      onOk: () => {
        Modal.confirm({
          title: 'Final Confirmation',
          content: 'This is your final warning. Your account and all associated data will be permanently deleted.',
          okText: 'Delete Forever',
          okType: 'danger',
          onOk: () => {
            message.success('Account deletion initiated. You will receive a confirmation email.')
          }
        })
      }
    })
  }

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'green'
      case 'pending': return 'orange'
      case 'cancelled': return 'red'
      case 'completed': return 'blue'
      default: return 'default'
    }
  }


  // Booking Table columns
  const bookingColumns: ColumnsType<Booking> = [

    {
      title: 'Date & Time',
      key: 'datetime',
      render: (_, record) => (
        <div>
          <div className="flex items-center gap-1">
            <CalendarOutlined className="text-gray-400" />
            <span>{new Date(record.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockCircleOutlined className="text-gray-400" />
            <span>{record.time} ({record.duration}h)</span>
          </div>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <span className="font-semibold">KSh {amount.toLocaleString()}</span>
      )
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <div className="space-y-1">
          <Tag color={getStatusColor(record.status)}>
            {record.status.toUpperCase()}
          </Tag>
        </div>
      )
    },

  ]

  // Payment Table columns
  const paymentColumns: ColumnsType<Payment> = [

    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => (
        <div className="flex items-center gap-1">
          <CalendarOutlined className="text-gray-400" />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'final_amount_invoiced',
      key: 'final_amount_invoiced',
      render: (amount, record) => (
        <span className="font-semibold text-[#3A8726FF]">
          KSh {(amount || record.amountPaid || record.amount || 0).toLocaleString()}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'payment_status',
      key: 'payment_status',
      render: (payment_status) => (
        <Tag color={
          payment_status === 'Completed' ? 'green' : 
          payment_status === 'Pending' ? 'orange' : 'red'
        }>
          {payment_status?.toUpperCase() || 'PENDING'}
        </Tag>
      )
    },
    {
      title: 'Method',
      dataIndex: 'payment_method',
      key: 'payment_method',
      render: (method) => (
        <span className="text-sm">{method || 'Card'}</span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            size="small" 
            icon={<DownloadOutlined />}
            onClick={() => downloadReceipt(record._id)}
            type="primary"
            className="bg-[#3A8726FF]"
          >
            PDF Receipt
          </Button>
        </div>
      )
    }
  ]

  // Show enhanced loading if not authenticated or data is loading
  if (!isAuthenticated || !currentUser || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 mx-auto mb-6"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-500 border-r-green-500 absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {!isAuthenticated ? '🔐 Authenticating...' : '📊 Loading account data...'}
            </h3>
            <p className="text-gray-600 text-sm">
              {!isAuthenticated ? 'Verifying your credentials' : 'Fetching your bookings and payments'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mobile-account-container">
        
        {/* Profile Header */}
        <div className='flex flex-col '>
          <div className='flex flex-row items-center justify-between'>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            </div>
            
          </div>

          {/* card with user info */}
          <div className='flex flex-col my-6 bg-white p-4 rounded-lg shadow-md border border-slate-50 text-sm premium-card'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <h2 className='text-lg font-semibold'>Welcome back, {currentUser?.first_name}!</h2>
                <p>Manage your account details and preferences.</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col premium-card p-6 mb-6 overflow-hidden'>
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            tabPosition="top"
            size={isMobile ? 'small' : 'large'}
          >
            {/* Bookings */}
            <TabPane 
              tab={
                <span className="flex items-center gap-1 text-sm sm:gap-2 text-black hover:text-green-800">
                  <span className="">My Bookings</span>
                  <div className='bg-green-100  text-xs font-semibold px-2 py-2 rounded-full'>
                    {bookings.length}
                  </div>
                </span>
              } 
              key="bookings"
            >
              <div className="p-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center my-4">
                  <div className=''>
                    <h2 className="text-lg sm:text-xl font-semibold heading-gradient ">
                      Bookings
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Manage your field reservations and track booking history
                    </p>
                  </div>
                </div>
                
                {/* Enhanced Mobile Booking Cards */}
                <div className="block sm:hidden space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CalendarOutlined className="text-2xl text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings yet</h3>
                      <p className="text-gray-500 mb-6 px-4">
                        Start by booking your first field session
                      </p>
                      <Link href="/booking">
                        <Button 
                          type="primary" 
                          size="large"
                          className="btn-primary-gradient rounded-lg"
                          icon={<CalendarOutlined />}
                        >
                          Make Your First Booking
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                    <Card key={booking.id} className="booking-card-mobile">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">⚽</span>
                              </div>
                              <div>
                                <div className="font-semibold text-gray-800">{booking.date}</div>
                                <div className="text-xs text-gray-500 font-mono">#{booking.id.slice(-8)}</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                <CalendarOutlined className="text-blue-500 text-xs" />
                              </div>
                              <span className="font-medium">{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                                <ClockCircleOutlined className="text-purple-500 text-xs" />
                              </div>
                              <span className="font-medium">{booking.time} ({booking.duration}h)</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Total Amount</span>
                            <span className="font-bold text-green-600 text-lg">
                              KSh {booking.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
        
                      </div>
                    </Card>
                    ))
                  )}
                </div>
                
                {/* Enhanced Desktop Table */}
                <div className="hidden sm:block">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <Table 
                      columns={bookingColumns}
                      dataSource={bookings}
                      rowKey="id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} bookings`,
                        responsive: true
                      }}
                      scroll={{ x: 800 }}
                      locale={{
                        emptyText: (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CalendarOutlined className="text-2xl text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No bookings found</h3>
                            <p className="text-gray-500 mb-6">Start by making your first field booking</p>
                            <Link href="/booking">
                              <Button 
                                type="primary" 
                                className="btn-primary-gradient rounded-lg"
                                icon={<CalendarOutlined />}
                              >
                                Make Your First Booking
                              </Button>
                            </Link>
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Payment History */}
            <TabPane 
              tab={
                <span className="flex items-center gap-1 text-sm sm:gap-2 text-black hover:text-green-800">
                  <span className="">Payment History</span>
                  <div className='bg-green-100  text-xs font-semibold px-2 py-2 rounded-full'>
                    {payments.length}
                  </div>
                </span>
              } 
              key="payments"
            >
              <div className="space-y-4 sm:space-y-6 my-8 md:mx-2 tablet-optimized desktop-enhanced">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold heading-gradient mb-2">
                    Payment History
                  </h2>
                  <p className="text-gray-600 text-sm">
                    View your payment transactions and download receipts
                  </p>
                </div>
                
                {/* Enhanced Mobile Payment Cards */}
                <div className="block sm:hidden space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCardOutlined className="text-2xl text-green-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">No payments yet</h3>
                      <p className="text-gray-500 px-4">
                        Your payment history will appear here after making bookings
                      </p>
                    </div>
                  ) : (
                    payments.map((payment) => (
                      <Card key={payment._id} className="payment-card-mobile">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                  <CreditCardOutlined className="text-white text-xs" />
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800">
                                    {payment.booking?.field?.name || 'Field Booking'}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">#{payment._id.slice(-8)}</div>
                                </div>
                              </div>
                            </div>
                            <Tag 
                              className={`text-xs font-medium ${
                                payment.payment_status === 'Completed' ? 'status-badge-confirmed' :
                                payment.payment_status === 'Pending' ? 'status-badge-pending' :
                                'status-badge-cancelled'
                              }`}
                            >
                              {payment.payment_status?.toUpperCase() || 'PENDING'}
                            </Tag>
                          </div>
                          
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3">
                            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                                  <CalendarOutlined className="text-blue-500 text-xs" />
                                </div>
                                <span className="font-medium">{new Date(payment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                                  <ClockCircleOutlined className="text-purple-500 text-xs" />
                                </div>
                                <span className="font-medium">{payment.booking?.time || 'N/A'} ({payment.booking?.duration || 0}h)</span>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/50">
                              <div>
                                <span className="text-xs text-gray-500">Payment Method</span>
                                <div className="font-medium text-gray-700">{payment.payment_method || 'Card'}</div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs text-gray-500">Amount Paid</span>
                                <div className="font-bold text-green-600 text-lg">
                                  KSh {(payment.final_amount_invoiced || payment.amountPaid || payment.amount || 0).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            icon={<DownloadOutlined />} 
                            block
                            onClick={() => downloadReceipt(payment._id)}
                            className="rounded-lg btn-primary text-white border-none"
                            size="middle"
                          >
                            Download PDF Receipt
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
                
                {/* Enhanced Desktop Payment Table */}
                <div className="hidden sm:block">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <Table 
                      columns={paymentColumns}
                      dataSource={payments}
                      rowKey="_id"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} payments`,
                        responsive: true
                      }}
                      scroll={{ x: 800 }}
                      locale={{
                        emptyText: (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                              <CreditCardOutlined className="text-2xl text-green-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No payment history</h3>
                            <p className="text-gray-500 mb-6">Your payment transactions will appear here</p>
                          </div>
                        )
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabPane>

            {/* Profile & Settings */}
            <TabPane 
              tab={
                <span className="flex items-center gap-1 text-sm sm:gap-2 text-black hover:text-green-800">
                  <span className="">Profile &amp; Settings</span>
                  
                </span>
              } 
              key="Profile"
            >
              <div className="space-y-4 sm:space-y-6 my-8 md:mx-2 tablet-optimized desktop-enhanced">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold heading-gradient mb-2">
                    My Profile
                  </h2>
                  <p className="text-gray-600 text-sm">
                    View and update your personal information
                  </p>
                </div>
                
                {/* Profile info */}
                <div className="">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <div className="p-6">
                     
                        
                      {/* Profile Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                          <div className='flex items-center justify-between flex-row'>
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="text-xl font-semibold text-gray-800">
                                  {currentUser?.first_name} {currentUser?.second_name}
                                </h4>
                                <p className="text-sm text-gray-500">BOFA Member</p>
                              </div>
                            </div>
                            {/* <Button 
                              type="primary"
                              icon={<EditOutlined />}
                              className="btn-primary border  rounded-lg"
                              onClick={() => setEditProfileModal(true)}
                            >
                              Edit Profile
                            </Button> */}
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <MailOutlined className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="font-medium text-gray-800">{currentUser?.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <PhoneOutlined className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                <p className="font-medium text-gray-800">{currentUser?.phone_number || 'Not provided'}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <CalendarOutlined className="text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Member Since</p>
                                <p className="font-medium text-gray-800">
                                  {new Date(currentUser?.createdAt || '').toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
            

          </Tabs>
        </div>
      </div>

      {/* Enhanced Edit Profile Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <EditOutlined className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your account information</p>
            </div>
          </div>
        }
        open={editProfileModal}
        onCancel={() => setEditProfileModal(false)}
        footer={null}
        width={isMobile ? '95%' : 600}
        centered
        className="enhanced-modal"
      >
        <div className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              👤 Full Name *
            </label>
            <Input 
              value={profileForm.name}
              onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              size="large"
              className="rounded-lg border-gray-300 focus:border-blue-500"
              prefix={<UserOutlined className="text-gray-400" />}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              📧 Email Address *
            </label>
            <Input 
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email address"
              size="large"
              className="rounded-lg border-gray-300 focus:border-blue-500"
              prefix={<MailOutlined className="text-gray-400" />}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              📱 Phone Number *
            </label>
            <Input 
              value={profileForm.phone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
              size="large"
              className="rounded-lg border-gray-300 focus:border-blue-500"
              prefix={<PhoneOutlined className="text-gray-400" />}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              🎂 Date of Birth
            </label>
            <Input 
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) => setProfileForm(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              size="large"
              className="rounded-lg border-gray-300 focus:border-blue-500"
              prefix={<CalendarOutlined className="text-gray-400" />}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button 
              type="primary" 
              className="btn-primary-gradient flex-1 sm:flex-none rounded-lg"
              loading={profileLoading}
              onClick={updateProfile}
              size="large"
              icon={<EditOutlined />}
            >
              Save Changes
            </Button>
            <Button 
              onClick={() => setEditProfileModal(false)}
              className="flex-1 sm:flex-none rounded-lg border-gray-300"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Enhanced Review Modal */}
      <Modal
        title={
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <StarOutlined className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Review {selectedBooking?.fieldName}
              </h3>
              <p className="text-sm text-gray-500">Share your experience with other players</p>
            </div>
          </div>
        }
        open={reviewModal}
        onCancel={() => setReviewModal(false)}
        footer={null}
        width={isMobile ? '95%' : 500}
        centered
        className="enhanced-modal"
      >
        <div className="space-y-6 pt-4">
          <div>
            <label className="block text-sm font-semibold mb-4 text-gray-700">
              ⭐ How was your experience?
            </label>
            <div className="flex justify-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <Rate 
                allowHalf 
                value={reviewForm.rating}
                onChange={(value) => setReviewForm(prev => ({ ...prev, rating: value }))}
                style={{ fontSize: '28px' }}
                className="text-yellow-500"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              {reviewForm.rating === 5 ? 'Excellent!' : 
               reviewForm.rating >= 4 ? 'Great!' : 
               reviewForm.rating >= 3 ? 'Good' : 
               reviewForm.rating >= 2 ? 'Fair' : 'Poor'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              💬 Tell us more about your experience
            </label>
            <TextArea 
              rows={4} 
              placeholder="What did you like? Any suggestions for improvement?"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
              showCount
              maxLength={500}
              className="rounded-lg border-gray-300 focus:border-yellow-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
            <Button 
              type="primary" 
              className="btn-primary-gradient flex-1 sm:flex-none rounded-lg"
              loading={reviewLoading}
              onClick={submitReview}
              size="large"
              icon={<StarOutlined />}
            >
              Submit Review
            </Button>
            <Button 
              onClick={() => setReviewModal(false)}
              className="flex-1 sm:flex-none rounded-lg border-gray-300"
              size="large"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </>
  )
}
