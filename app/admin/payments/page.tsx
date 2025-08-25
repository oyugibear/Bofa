'use client'

import React, { useState } from 'react'
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
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'

// Stats Component for Payments
const PaymentStats = () => {
  const stats = [
    { 
      title: 'Total Revenue', 
      value: 'KSh 1.25M', 
      icon: <DollarOutlined />, 
      color: 'text-blue-600', 
      change: '+15%',
      subtitle: 'All time revenue'
    },
    { 
      title: 'This Month', 
      value: 'KSh 285K', 
      icon: <CheckCircleOutlined />, 
      color: 'text-green-600', 
      change: '+18%',
      subtitle: 'Monthly revenue'
    },
    { 
      title: 'Pending Payments', 
      value: 'KSh 45K', 
      icon: <ClockCircleOutlined />, 
      color: 'text-yellow-600', 
      change: '-8%',
      subtitle: 'Awaiting payment'
    },
    { 
      title: 'Failed Payments', 
      value: 'KSh 12K', 
      icon: <CloseCircleOutlined />, 
      color: 'text-red-600', 
      change: '-25%',
      subtitle: 'Failed transactions'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last month
              </p>
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

// Payments Table Component
const PaymentsTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  const payments = [
    { 
      id: 'PAY001',
      bookingId: 'BK001',
      userId: 'U001',
      userName: 'John Doe',
      userEmail: 'john@email.com',
      amount: 3000,
      method: 'M-Pesa',
      status: 'Completed',
      transactionId: 'MP123456789',
      createdAt: '2025-08-10 14:35',
      description: 'Main Field booking payment',
      processingFee: 30,
      netAmount: 2970
    },
    { 
      id: 'PAY002',
      bookingId: 'BK002',
      userId: 'U002',
      userName: 'Jane Smith',
      userEmail: 'jane@email.com',
      amount: 1500,
      method: 'Card',
      status: 'Pending',
      transactionId: 'CD987654321',
      createdAt: '2025-08-11 09:20',
      description: 'Training Pitch booking payment',
      processingFee: 45,
      netAmount: 1455
    },
    { 
      id: 'PAY003',
      bookingId: 'BK003',
      userId: 'U003',
      userName: 'Mike Johnson',
      userEmail: 'mike@email.com',
      amount: 2000,
      method: 'Cash',
      status: 'Completed',
      transactionId: 'CASH001',
      createdAt: '2025-08-12 16:45',
      description: 'Indoor Field booking payment',
      processingFee: 0,
      netAmount: 2000
    },
    { 
      id: 'PAY004',
      bookingId: 'BK004',
      userId: 'U004',
      userName: 'Sarah Wilson',
      userEmail: 'sarah@email.com',
      amount: 1500,
      method: 'M-Pesa',
      status: 'Failed',
      transactionId: 'MP987654321',
      createdAt: '2025-08-13 08:30',
      description: 'Training Pitch booking payment',
      processingFee: 15,
      netAmount: 1485
    },
    { 
      id: 'PAY005',
      bookingId: 'BK005',
      userId: 'U005',
      userName: 'David Brown',
      userEmail: 'david@email.com',
      amount: 3000,
      method: 'Card',
      status: 'Completed',
      transactionId: 'CD456789123',
      createdAt: '2025-08-13 12:15',
      description: 'Main Field booking payment',
      processingFee: 90,
      netAmount: 2910
    },
    { 
      id: 'PAY006',
      bookingId: 'BK006',
      userId: 'U006',
      userName: 'Lisa Anderson',
      userEmail: 'lisa@email.com',
      amount: 5000,
      method: 'Bank Transfer',
      status: 'Refunded',
      transactionId: 'BT789123456',
      createdAt: '2025-08-13 14:20',
      description: 'Tournament registration refund',
      processingFee: 50,
      netAmount: 4950
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Refunded': return 'bg-gray-100 text-gray-800'
      case 'Processing': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'M-Pesa': return 'bg-green-100 text-green-800'
      case 'Card': return 'bg-blue-100 text-blue-800'
      case 'Cash': return 'bg-gray-100 text-gray-800'
      case 'Bank Transfer': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'M-Pesa': return <PhoneOutlined />
      case 'Card': return <CreditCardOutlined />
      case 'Cash': return <DollarOutlined />
      case 'Bank Transfer': return <DollarOutlined />
      default: return <DollarOutlined />
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status.toLowerCase() === statusFilter
    const matchesMethod = methodFilter === 'all' || payment.method.toLowerCase().replace(/[^a-z]/g, '') === methodFilter
    return matchesSearch && matchesStatus && matchesMethod
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">All Payments</h3>
            <p className="text-gray-600 text-sm mt-1">Track payments and financial transactions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent w-full sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="cash">Cash</option>
              <option value="banktransfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="font-mono text-sm font-medium text-gray-900">{payment.id}</div>
                    <div className="text-xs text-gray-500">{payment.description}</div>
                    <div className="font-mono text-xs text-gray-400">{payment.transactionId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                    <div className="text-sm text-gray-500">{payment.userEmail}</div>
                    <div className="text-xs text-gray-400 font-mono">{payment.userId}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <CalendarOutlined className="text-gray-400 text-xs" />
                    <span className="font-mono text-sm text-gray-900">{payment.bookingId}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      KSh {payment.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Fee: KSh {payment.processingFee}
                    </div>
                    <div className="text-xs font-medium text-green-600">
                      Net: KSh {payment.netAmount.toLocaleString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{getMethodIcon(payment.method)}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.method)}`}>
                      {payment.method}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(payment.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View Receipt">
                      <EyeOutlined />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Download Receipt">
                      <DownloadOutlined />
                    </button>
                    {payment.status === 'Failed' && (
                      <button className="text-orange-600 hover:text-orange-800" title="Retry Payment">
                        <EditOutlined />
                      </button>
                    )}
                    {payment.status === 'Completed' && (
                      <button className="text-red-600 hover:text-red-800" title="Initiate Refund">
                        <DeleteOutlined />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPayments.length}</span> of{' '}
          <span className="font-medium">{payments.length}</span> results
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
          <button className="px-3 py-1 text-sm bg-[#3A8726FF] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
        </div>
      </div>
    </div>
  )
}

// Main Payments Page Component
export default function PaymentsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col'>
        {/* Top Header for Mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
          <h1 className="text-xl font-bold text-gray-800">Payments</h1>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
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
              <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <DownloadOutlined /> Export Report
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                  <PlusOutlined /> Manual Payment
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <PaymentStats />

          {/* Payments Table */}
          <PaymentsTable />
        </div>
      </div>
    </div>
  )
}
