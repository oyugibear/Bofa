'use client'

import React, { useEffect, useState, useRef } from 'react'
import { 
  DollarOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  PhoneOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import { Skeleton, Spin, message } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import PaymentsTable from '@/components/admin/Tables/PaymentsTable'
import { paymentAPI } from '@/utils/api'
import { Payment } from '@/types'

// Stats Component for Payments
const PaymentStats = ({ payments, loading }: { payments: Payment[], loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    { 
      title: 'Total Revenue', 
      value: payments.reduce((sum, payment) => sum + payment.final_amount_invoiced, 0).toLocaleString('en-US', { style: 'currency', currency: 'KSH' }),
      icon: <DollarOutlined />, 
      color: 'text-blue-600', 
      change: '+15%',
      subtitle: 'All time revenue'
    },
    { 
      title: 'This Month', 
      value: payments.filter(payment => new Date(payment.createdAt).getMonth() === new Date().getMonth()).reduce((sum, payment) => sum + payment.final_amount_invoiced, 0).toLocaleString('en-US', { style: 'currency', currency: 'KSH' }),
      icon: <CheckCircleOutlined />, 
      color: 'text-green-600', 
      change: '+18%',
      subtitle: 'Monthly revenue'
    },
    { 
      title: 'Pending Payments', 
      value: payments.filter(payment => payment.payment_status == 'Pending').reduce((sum, payment) => sum + payment.final_amount_invoiced, 0).toLocaleString('en-US', { style: 'currency', currency: 'KSH' }),
      icon: <ClockCircleOutlined />, 
      color: 'text-yellow-600', 
      change: '-8%',
      subtitle: 'Awaiting payment'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              {/* <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p> */}
            </div>
            <div className={`${stat.color} text-xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Main Payments Page Component
export default function PaymentsPage() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [payments, setPayments] = useState([]) // Replace with actual data fetching logic
  const [loading, setLoading] = useState(true)
  const [componentsReady, setComponentsReady] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const paymentsResponse = await paymentAPI.getAll()
        console.log("Payments fetched:", paymentsResponse.data)
        setPayments(paymentsResponse.data)
      } catch (error) {
        console.error('Error fetching Payments:', error)
        message.error('Failed to load payments data')
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [refresh])

  // Wrapper function for setRefresh to match expected signature
  const handleRefresh = () => {
    setRefresh(prev => !prev)
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
            <p className="mt-4 text-gray-600">Loading payments data...</p>
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
              <h1 className="text-xl font-bold text-gray-800">Payments</h1>
              <p className="text-sm text-gray-500">Financial transactions</p>
            </div>
          </div>
        </div>
        
        {/* Enhanced Main Content */}
        <div className='flex-1 p-4 md:p-8 overflow-y-auto'>
          {/* Modern Page Header */}
          <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/admin" className="hover:text-[#3A8726FF] transition-colors font-medium">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">Payments</span>
            </nav>
            
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
                <p className="text-gray-600">Track payments and financial transactions</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <PaymentStats payments={payments} loading={loading} />

          {/* Payments Table */}
          <PaymentsTable payments={payments} setRefresh={handleRefresh} loading={loading} />
        </div>
      </div>
    </div>
  )
}
