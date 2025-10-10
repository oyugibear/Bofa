import React, { useMemo } from 'react'
import { 
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  ToolOutlined,
  WarningOutlined
} from '@ant-design/icons'
import { BookingDetails, Payment, Field, UserType } from '@/types'

interface AlertsCenterProps {
  data: { 
    bookings: BookingDetails[], 
    payments: Payment[], 
    users: UserType[],
    fields?: Field[]
  }
}

interface Alert {
  id: string
  type: 'warning' | 'error' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  priority: 'high' | 'medium' | 'low'
  action?: {
    label: string
    onClick: () => void
  }
}

export default function AlertsCenter({ data }: AlertsCenterProps) {
  const alerts = useMemo(() => {
    const alertsList: Alert[] = []
    
    // Check for overdue payments
    const overduePayments = data.payments.filter(payment => {
      if (payment.status !== 'pending') return false
      const createdAt = new Date(payment.createdAt)
      const daysSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      return daysSince > 7 // More than 7 days old
    })
    
    if (overduePayments.length > 0) {
      alertsList.push({
        id: 'overdue-payments',
        type: 'warning',
        title: 'Overdue Payments',
        message: `${overduePayments.length} payments are overdue (>7 days)`,
        timestamp: new Date(),
        priority: 'high'
      })
    }
    
    // Check for pending bookings that need approval
    const pendingBookings = data.bookings.filter(booking => booking.status === 'pending')
    if (pendingBookings.length > 5) {
      alertsList.push({
        id: 'pending-bookings',
        type: 'warning',
        title: 'Multiple Pending Bookings',
        message: `${pendingBookings.length} bookings awaiting approval`,
        timestamp: new Date(),
        priority: 'medium'
      })
    }
    
    // Check for failed payments in the last 24 hours
    const recentFailedPayments = data.payments.filter(payment => {
      if (payment.status !== 'failed') return false
      const createdAt = new Date(payment.createdAt)
      const hoursSince = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60)
      return hoursSince <= 24
    })
    
    if (recentFailedPayments.length > 0) {
      alertsList.push({
        id: 'failed-payments',
        type: 'error',
        title: 'Recent Payment Failures',
        message: `${recentFailedPayments.length} payments failed in the last 24 hours`,
        timestamp: new Date(),
        priority: 'high'
      })
    }
    
    // Check for inactive fields
    const inactiveFields = data.fields?.filter(field => field.status !== 'active') || []
    if (inactiveFields.length > 0) {
      alertsList.push({
        id: 'inactive-fields',
        type: 'info',
        title: 'Field Maintenance',
        message: `${inactiveFields.length} fields are currently inactive or under maintenance`,
        timestamp: new Date(),
        priority: 'medium'
      })
    }
    
    // Check for bookings today
    const today = new Date().toISOString().split('T')[0]
    const todaysBookings = data.bookings.filter(booking => 
      booking.date_requested?.startsWith(today)
    )
    
    if (todaysBookings.length === 0) {
      alertsList.push({
        id: 'no-bookings-today',
        type: 'info',
        title: 'No Bookings Today',
        message: 'No bookings scheduled for today',
        timestamp: new Date(),
        priority: 'low'
      })
    }
    
    // Check for high revenue day (positive alert)
    const todaysRevenue = data.payments
      .filter(payment => 
        payment.status === 'completed' &&
        payment.createdAt?.startsWith(today)
      )
      .reduce((acc, payment) => acc + (payment?.final_amount_invoiced ?? 0), 0)
    
    if (todaysRevenue > 50000) { // More than 50K KSh
      alertsList.push({
        id: 'high-revenue',
        type: 'success',
        title: 'Excellent Revenue Day',
        message: `Today's revenue: KSh ${todaysRevenue.toLocaleString()}`,
        timestamp: new Date(),
        priority: 'low'
      })
    }
    
    // Sort by priority and timestamp
    return alertsList.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })
  }, [data])

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <WarningOutlined className="text-yellow-600" />
      case 'error':
        return <CloseCircleOutlined className="text-red-600" />
      case 'info':
        return <InfoCircleOutlined className="text-blue-600" />
      case 'success':
        return <CheckCircleOutlined className="text-green-600" />
      default:
        return <InfoCircleOutlined className="text-gray-600" />
    }
  }

  const getAlertBgColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getPriorityBadge = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">High</span>
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Medium</span>
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Low</span>
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Alerts & Notifications</h3>
        <div className="flex items-center gap-2">
          {alerts.filter(a => a.priority === 'high').length > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
              {alerts.filter(a => a.priority === 'high').length} High Priority
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleOutlined className="text-4xl text-green-500 mb-2" />
            <p className="text-gray-500">All systems operating normally</p>
            <p className="text-sm text-gray-400">No alerts or notifications at this time</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {alert.title}
                    </h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {alert.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      <ClockCircleOutlined className="mr-1" />
                      {alert.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {alert.action && (
                      <button
                        onClick={alert.action.onClick}
                        className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        {alert.action.label}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Quick Actions:</p>
            <div className="flex gap-2">
              <button className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                <CalendarOutlined className="mr-1" />
                View Bookings
              </button>
              <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                <DollarOutlined className="mr-1" />
                Payments
              </button>
              <button className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors">
                <ToolOutlined className="mr-1" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
