import React from 'react'
import { 
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
} from '@ant-design/icons'
import { Booking, BookingDetails, Payment } from '@/types'
import StatCard from './StatCard'

export default function BookingStats({ bookings, payments }: { bookings: BookingDetails[], payments: Payment[] }) {
  const stats = [
      { 
        title: 'Total Bookings', 
        value: bookings.length.toString(), 
        icon: <CalendarOutlined />, 
        color: 'text-blue-600', 
        change: '+12%',
        subtitle: 'All time bookings'
      },
      { 
        title: 'Today\'s Bookings', 
        value: bookings.filter(booking => new Date(booking.date_requested).toDateString() === new Date().toDateString()).length.toString(), 
        icon: <CheckCircleOutlined />, 
        color: 'text-green-600', 
        change: '+3',
        subtitle: 'Active today'
      },
      { 
        title: 'Pending Bookings', 
        value: bookings.filter(booking => booking.status == 'pending').length.toString(), 
        icon: <ClockCircleOutlined />, 
        color: 'text-yellow-600', 
        change: '-2',
        subtitle: 'Awaiting confirmation'
      },
    //   { 
    //     title: 'Revenue This Month', 
    //     value: `KSh ${payments.reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0).toLocaleString()}`,
    //     icon: <DollarOutlined />, 
    //     color: 'text-purple-600', 
    //     change: '+18%',
    //     subtitle: 'From bookings'
    //   },
    ]
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>
    )
}
