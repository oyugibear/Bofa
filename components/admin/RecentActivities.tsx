import React, { useMemo } from 'react'
import { 
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  TeamOutlined
} from '@ant-design/icons'
import { BookingDetails, Payment, UserType } from '@/types'

interface RecentActivitiesProps {
  data: { 
    bookings: BookingDetails[], 
    payments: Payment[], 
    users: UserType[] 
  }
}

interface Activity {
  id: string
  type: 'booking' | 'payment' | 'user_registration' | 'booking_update' | 'payment_update'
  title: string
  description: string
  timestamp: Date
  user?: UserType
  status?: 'success' | 'pending' | 'failed' | 'cancelled'
  amount?: number
  relatedId?: string
}

export default function RecentActivities({ data }: RecentActivitiesProps) {
  const activities = useMemo(() => {
    const activitiesList: Activity[] = []
    
    // Add booking activities
    data.bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10) // Get most recent 10 bookings
      .forEach(booking => {
        activitiesList.push({
          id: `booking-${booking._id}`,
          type: 'booking',
          title: 'New Booking Created',
          description: `${booking.field?.name || 'Field'} booked for ${booking.duration} hours`,
          timestamp: new Date(booking.createdAt),
          user: booking.client,
          status: booking.status === 'confirmed' ? 'success' : 
                  booking.status === 'cancelled' ? 'cancelled' : 'pending',
          amount: booking.total_price,
          relatedId: booking._id
        })
      })
    
    // Add payment activities
    data.payments
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10) // Get most recent 10 payments
      .forEach(payment => {
        const statusMap: { [key: string]: 'success' | 'pending' | 'failed' } = {
          'completed': 'success',
          'pending': 'pending',
          'failed': 'failed'
        }
        
        activitiesList.push({
          id: `payment-${payment._id}`,
          type: 'payment',
          title: payment.status === 'completed' ? 'Payment Received' : 
                 payment.status === 'failed' ? 'Payment Failed' : 'Payment Pending',
          description: `${payment.payment_method || 'Payment'} for KSh ${payment.final_amount_invoiced?.toLocaleString()}`,
          timestamp: new Date(payment.createdAt),
          status: statusMap[payment.status || 'pending'] || 'pending',
          amount: payment.final_amount_invoiced,
          relatedId: payment._id
        })
      })
    
    // Add user registration activities
    data.users
      .filter(user => user.createdAt) // Only users with creation dates
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 5) // Get most recent 5 users
      .forEach(user => {
        activitiesList.push({
          id: `user-${user._id}`,
          type: 'user_registration',
          title: 'New User Registered',
          description: `${user.first_name} ${user.second_name} joined the platform`,
          timestamp: new Date(user.createdAt!),
          user: user,
          status: user.profile_status === 'Completed' ? 'success' : 'pending',
          relatedId: user._id
        })
      })
    
    // Sort all activities by timestamp and take the most recent 15
    return activitiesList
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 15)
  }, [data])

  const getActivityIcon = (type: Activity['type'], status?: Activity['status']) => {
    switch (type) {
      case 'booking':
        return <CalendarOutlined className={`${
          status === 'success' ? 'text-green-600' :
          status === 'cancelled' ? 'text-red-600' :
          'text-blue-600'
        }`} />
      case 'payment':
        return <DollarOutlined className={`${
          status === 'success' ? 'text-green-600' :
          status === 'failed' ? 'text-red-600' :
          'text-yellow-600'
        }`} />
      case 'user_registration':
        return <UserOutlined className="text-blue-600" />
      case 'booking_update':
        return <SettingOutlined className="text-orange-600" />
      case 'payment_update':
        return <DollarOutlined className="text-purple-600" />
      default:
        return <ClockCircleOutlined className="text-gray-600" />
    }
  }

  const getStatusBadge = (status?: Activity['status']) => {
    if (!status) return null
    
    switch (status) {
      case 'success':
        return <CheckCircleOutlined className="text-green-500 text-sm" />
      case 'failed':
      case 'cancelled':
        return <CloseCircleOutlined className="text-red-500 text-sm" />
      case 'pending':
        return <ClockCircleOutlined className="text-yellow-500 text-sm" />
      default:
        return null
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const getUserDisplayName = (user?: UserType) => {
    if (!user) return 'System'
    return `${user.first_name || ''} ${user.second_name || ''}`.trim() || 'Unknown User'
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ClockCircleOutlined className="text-4xl text-gray-300 mb-2" />
            <p className="text-gray-500">No recent activities</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Activity Icon */}
              <div className="p-2 bg-gray-100 rounded-full flex-shrink-0 mt-0.5">
                {getActivityIcon(activity.type, activity.status)}
              </div>
              
              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </h4>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {activity.description}
                    </p>
                    
                    {/* User and Amount Info */}
                    <div className="flex items-center gap-4 mt-2">
                      {activity.user && (
                        <div className="flex items-center gap-1">
                          <TeamOutlined className="text-xs text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {getUserDisplayName(activity.user)}
                          </span>
                        </div>
                      )}
                      
                      {activity.amount && (
                        <div className="flex items-center gap-1">
                          <DollarOutlined className="text-xs text-gray-400" />
                          <span className="text-xs font-medium text-gray-700">
                            KSh {activity.amount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Activity Summary */}
      {activities.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-blue-600">
                {activities.filter(a => a.type === 'booking').length}
              </p>
              <p className="text-xs text-gray-500">Bookings</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-green-600">
                {activities.filter(a => a.type === 'payment' && a.status === 'success').length}
              </p>
              <p className="text-xs text-gray-500">Payments</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-purple-600">
                {activities.filter(a => a.type === 'user_registration').length}
              </p>
              <p className="text-xs text-gray-500">New Users</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
