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
import { Skeleton } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import PaymentsTable from '@/components/admin/Tables/PaymentsTable'
import { LoadingScreen } from '@/components/common'
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
    const fetchBookings = async () => {
    setLoading(true)
    try {
      const paymentsResponse = await paymentAPI.getAll()
      console.log("Payments fetched:", paymentsResponse.data)
      setPayments(paymentsResponse.data)
    } catch (error) {
      console.error('Error fetching Payments:', error)
    } finally {
      // Don't set loading to false immediately
      // Wait for components to render
      setTimeout(() => {
        setLoading(false)
      }, 100)
    }
    }

    fetchBookings()
  }, [refresh])

  // Effect to check if components have rendered
  useEffect(() => {
    if (!loading && payments.length >= 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        // Additional delay to ensure all child components have rendered
        setTimeout(() => {
          setComponentsReady(true)
        }, 200)
      })
    }
  }, [loading, payments])

  // Reset components ready state when refresh happens
  useEffect(() => {
    if (refresh) {
      setComponentsReady(false)
    }
  }, [refresh])

  // Show loading screen until both data is loaded and components are ready
  const showLoading = loading || !componentsReady

  // Wrapper function for setRefresh to match expected signature
  const handleRefresh = () => {
    setRefresh(prev => !prev)
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Loading Screen Component */}
      <LoadingScreen 
        isLoading={showLoading}
        title="Loading Payments"
        description="Please wait while we fetch your payment data..."
      />
      
      <div className='flex-1 flex flex-col' ref={contentRef}>
        {/* Top Header for Mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
          <h1 className="text-xl font-bold text-gray-800">Payments</h1>
        </div>
        
        {/* Main Content */}
        <div 
          className={`flex-1 p-4 md:p-6 overflow-x-hidden transition-all duration-300 ${
            showLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Page Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Payments</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Management</h1>
                <p className="text-gray-600 mt-1">Track payments and financial transactions</p>
              </div>
              {/* <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <DownloadOutlined /> Export Report
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                  <PlusOutlined /> Manual Payment
                </button>
              </div> */}
            </div>
          </div>

          {/* Stats Cards */}
          <PaymentStats payments={payments} loading={showLoading} />

          {/* Payments Table */}
          <PaymentsTable payments={payments} setRefresh={handleRefresh} loading={showLoading} />
        </div>
      </div>
    </div>
  )
}
