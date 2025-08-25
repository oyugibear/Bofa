import { User } from '@/services/users'
import { Booking, Payment } from '@/types'
import React from 'react'
import { 
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
} from '@ant-design/icons'

export default function Stats({ data } : { data: { bookings: Booking[], payments: Payment[], users: User[] } }) {
  const stats = [
    { title: 'Total Bookings', value: data.bookings.length, icon: <CalendarOutlined />, color: 'text-blue-600', change: '+12%' },
    { title: 'Active Users', value: data.users.length, icon: <UserOutlined />, color: 'text-green-600', change: '+8%' },
    { title: 'Total Revenue', value: `KSh ${data.payments.reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0).toLocaleString()}`, icon: <DollarOutlined />, color: 'text-purple-600', change: '+15%' },
    // { title: 'Available Fields', value: '3/4', icon: <EnvironmentOutlined />, color: 'text-orange-600', change: '75%' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-green-600 text-xs mt-1">{stat.change} from last month</p>
            </div>
            <div className={`${stat.color} text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
