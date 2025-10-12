import { BookingDetails, Payment, UserType } from '@/types'
import React, { useMemo } from 'react'
import { 
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined
} from '@ant-design/icons'

export default function Stats({ data } : { data: { bookings: BookingDetails[], payments: Payment[], users: UserType[] } }) {
  
  // Calculate enhanced statistics
  const stats = useMemo(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    // Today's bookings
    const todaysBookings = data.bookings.filter(booking => 
      booking.date_requested?.startsWith(todayStr) || 
      booking.createdAt?.startsWith(todayStr)
    )
    
    // Confirmed bookings
    const confirmedBookings = data.bookings.filter(booking => 
      booking.status === 'confirmed' || booking.status === 'completed'
    )
    
    // Pending payments
    const pendingPayments = data.payments.filter(payment => 
      payment.status === 'pending'
    )
    
    // Total revenue
    const totalRevenue = data.payments
      .filter(payment => payment.status === 'completed')
      .reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0)

    // Today's revenue  
    const todaysRevenue = data.payments
      .filter(payment => 
        payment.status === 'completed' &&
        payment.createdAt?.startsWith(todayStr)
      )
      .reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0)
    
    return [
      { 
        title: "Today's Bookings", 
        value: todaysBookings.length, 
        icon: <CalendarOutlined />, 
        color: 'text-blue-600', 
        change: `${data.bookings.length} total`,
        changeColor: 'text-gray-500'
      },
      { 
        title: 'Confirmed Bookings', 
        value: confirmedBookings.length, 
        icon: <CheckCircleOutlined />, 
        color: 'text-green-600', 
        change: `${Math.round((confirmedBookings.length / Math.max(data.bookings.length, 1)) * 100)}% success rate`,
        changeColor: 'text-green-600'
      },
      { 
        title: "Today's Revenue", 
        value: `KSh ${todaysRevenue.toLocaleString()}`, 
        icon: <DollarOutlined />, 
        color: 'text-purple-600', 
        change: `KSh ${totalRevenue.toLocaleString()} total`,
        changeColor: 'text-gray-500'
      },
      { 
        title: 'Pending Payments', 
        value: pendingPayments.length, 
        icon: <WarningOutlined />, 
        color: 'text-orange-600', 
        change: pendingPayments.length > 0 ? 'Needs attention' : 'All clear',
        changeColor: pendingPayments.length > 0 ? 'text-orange-600' : 'text-green-600'
      },
    ]
  }, [data.bookings, data.payments, data.users])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-sm font-medium truncate">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{stat.value}</p>
              <p className={`${stat.changeColor} text-xs mt-1 font-medium truncate`}>{stat.change}</p>
            </div>
            <div className={`${stat.color} text-3xl opacity-80 flex-shrink-0 ml-3`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
