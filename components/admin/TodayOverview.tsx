import React, { useMemo } from 'react'
import { 
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  EnvironmentOutlined
} from '@ant-design/icons'
import { BookingDetails, Payment, UserType } from '@/types'

interface TodayOverviewProps {
  data: { 
    bookings: BookingDetails[], 
    payments: Payment[], 
    users: UserType[] 
  }
}

export default function TodayOverview({ data }: TodayOverviewProps) {
  const todayData = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const currentHour = today.getHours()
    
    // Filter today's bookings
    const todaysBookings = data.bookings.filter(booking => 
      booking.date_requested?.startsWith(todayStr) || 
      booking.createdAt?.startsWith(todayStr)
    )
    
    // Upcoming bookings (next 4 hours)
    const upcomingBookings = todaysBookings.filter(booking => {
      if (!booking.time) return false
      const bookingHour = parseInt(booking.time.split(':')[0])
      return bookingHour >= currentHour && bookingHour <= currentHour + 4
    })
    
    // Today's revenue
    const todaysRevenue = data.payments
      .filter(payment => 
        payment.status === 'completed' &&
        payment.createdAt?.startsWith(todayStr)
      )
      .reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0)
    
    // Pending tasks
    const pendingPayments = data.payments.filter(payment => payment.status === 'pending').length
    const pendingBookings = data.bookings.filter(booking => booking.status === 'pending').length
    
    return {
      todaysBookings,
      upcomingBookings,
      todaysRevenue,
      pendingPayments,
      pendingBookings
    }
  }, [data])

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Facility Status & Schedule</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <ClockCircleOutlined />
          <span>{currentTime}</span>
        </div>
      </div>


      {/* Upcoming Bookings List */}
      {todayData.upcomingBookings.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">Immediate Schedule</h4>
          <div className="space-y-2">
            {todayData.upcomingBookings.slice(0, 3).map((booking, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-blue-100 rounded-full flex-shrink-0">
                    <UserOutlined className="text-blue-600 text-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {typeof booking.client === 'object' && booking.client 
                        ? `${booking.client.first_name || ''} ${booking.client.second_name || ''}`.trim() || 'Unknown Client'
                        : booking.team_name || 'Unknown Client'
                      }
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {booking.time} • {booking.duration}h • {booking.field?.name || 'Field'}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </div>
              </div>
            ))}
            
            {todayData.upcomingBookings.length > 3 && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mt-2">
                  +{todayData.upcomingBookings.length - 3} more upcoming bookings
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No upcoming bookings */}
      {todayData.upcomingBookings.length === 0 && (
        <div className="text-center py-6">
          <ClockCircleOutlined className="text-4xl text-gray-300 mb-2" />
          <p className="text-gray-500 font-medium">Schedule Clear</p>
          <p className="text-sm text-gray-400">No immediate bookings in the next 4 hours</p>
        </div>
      )}
    </div>
  )
}
