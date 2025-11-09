'use client'

import React, { useEffect, useState } from 'react'
import { 
  PlusOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CalendarOutlined,
  FileExcelOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { Spin, message, Dropdown, Menu } from 'antd'
import SideMenu from '../../../components/admin/SideMenu'
import { Booking, Payment, BookingDetails } from '@/types'
import { bookingAPI, paymentAPI } from '@/utils/api'
import { filterBookingsByPeriod, formatBookingsForExport } from '@/utils/csvExport'
import { useCSVExport } from '@/hooks/useCSVExport'
import StatCard from '@/components/admin/StatCard'
import BookingStats from '@/components/admin/BookingStats'
import BookingTable from '@/components/admin/BookingTable'
import BookingCalendar from '@/components/admin/BookingCalendar'
import NewBookingModal from '@/components/admin/NewBookingModal'


// Bookings Table Component


// Main Bookings Page Component
export default function BookingsPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const [bookings, setBookings] = useState<BookingDetails[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false)
    
    // Use CSV export hook
    const { exportData, isExporting } = useCSVExport({
        onSuccess: (msg) => message.success(msg),
        onError: (error) => message.error(error)
    })

    // fetch bookings data
    useEffect(() => {
        const fetchBookings = async () => {
        setLoading(true)
        try {
            const response = await bookingAPI.getAll()
            const paymentsResponse = await paymentAPI.getAll()
            console.log("Bookings fetched:", response.data)
            setBookings(response.data as BookingDetails[])
            setPayments(paymentsResponse.data)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
        }

        fetchBookings()
    }, [refresh])

    // Wrapper function for setRefresh to match expected signature
    const handleRefresh = () => {
        setRefresh(prev => !prev)
    }

    // Export functionality using the CSV hook
    const handleExport = async (period: 'all' | 'today' | 'week' | 'month') => {
        try {
            // Filter bookings by period
            const filteredBookings = filterBookingsByPeriod(bookings, period)
            
            if (filteredBookings.length === 0) {
                message.warning(`No bookings found for ${period === 'all' ? 'export' : period}`)
                return
            }

            // Format bookings for export
            const formattedData = formatBookingsForExport(filteredBookings)
            
            // Export using the hook
            await exportData(formattedData, `bookings-${period}`)
            
        } catch (error) {
            console.error('Export error:', error)
            message.error('Failed to export bookings')
        }
    }

    // Calculate quick stats for export menu using utility functions
    const todayCount = filterBookingsByPeriod(bookings, 'today').length
    const weekCount = filterBookingsByPeriod(bookings, 'week').length
    const monthCount = filterBookingsByPeriod(bookings, 'month').length

    // Export menu items
    const exportMenu = (
        <Menu
            items={[
                {
                    key: 'all',
                    label: (
                        <div className="flex justify-between items-center min-w-[200px]">
                            <span>All Bookings</span>
                            <span className="text-gray-500 text-sm">({bookings.length})</span>
                        </div>
                    ),
                    onClick: () => handleExport('all'),
                },
                {
                    key: 'today',
                    label: (
                        <div className="flex justify-between items-center min-w-[200px]">
                            <span>Today's Bookings</span>
                            <span className="text-gray-500 text-sm">({todayCount})</span>
                        </div>
                    ),
                    onClick: () => handleExport('today'),
                },
                {
                    key: 'week',
                    label: (
                        <div className="flex justify-between items-center min-w-[200px]">
                            <span>Last 7 Days</span>
                            <span className="text-gray-500 text-sm">({weekCount})</span>
                        </div>
                    ),
                    onClick: () => handleExport('week'),
                },
                {
                    key: 'month',
                    label: (
                        <div className="flex justify-between items-center min-w-[200px]">
                            <span>Last 30 Days</span>
                            <span className="text-gray-500 text-sm">({monthCount})</span>
                        </div>
                    ),
                    onClick: () => handleExport('month'),
                },
            ]}
        />
    )

    

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
                        <p className="mt-4 text-gray-600">Loading booking data...</p>
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
                        <h1 className="text-xl font-bold text-gray-800">Bookings</h1>
                        <p className="text-sm text-gray-500">Manage reservations</p>
                    </div>
                    <button 
                        onClick={() => setIsNewBookingModalOpen(true)}
                        className="p-2 bg-[#3A8726FF] text-white rounded-full hover:bg-[#2d6b1f] transition-colors shadow-lg"
                        title="New Booking"
                    >
                        <PlusOutlined />
                    </button>
                </div>
            </div>
            
            {/* Enhanced Main Content */}
            <div className='flex-1 p-4 md:p-8 overflow-y-auto text-sm'>
                {/* Modern Page Header */}
                <div className="mb-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/admin" className="hover:text-[#3A8726FF] transition-colors font-medium">
                            Dashboard
                        </Link>
                        <span className="text-gray-300">/</span>
                        <span className="text-gray-900 font-semibold">Bookings</span>
                    </nav>
                    
                    {/* Header Content */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">Booking Management</h1>
                                        <p className="text-gray-600 mt-1 text-sm">Manage field bookings, reservations and customer interactions</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <button 
                                    onClick={handleRefresh}
                                    disabled={loading}
                                    className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Refresh Data"
                                >
                                    {loading ? <Spin size="small" /> : <ReloadOutlined />} Refresh
                                </button>
                                <Dropdown overlay={exportMenu} placement="bottomRight" trigger={['click']}>
                                    <button 
                                        disabled={isExporting || loading}
                                        className={`px-4 py-2.5 border border-gray-300 rounded-xl flex items-center gap-2 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                            isExporting 
                                                ? 'text-[#3A8726FF] border-[#3A8726FF] bg-[#3A8726FF] bg-opacity-5' 
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                        title={isExporting ? "Exporting..." : "Export Data"}
                                    >
                                        {isExporting ? (
                                            <>
                                                <Spin size="small" /> Exporting...
                                            </>
                                        ) : (
                                            <>
                                                <FileExcelOutlined /> Export <DownloadOutlined />
                                            </>
                                        )}
                                    </button>
                                </Dropdown>
                                <button 
                                    onClick={() => setIsNewBookingModalOpen(true)}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-[#3A8726FF] text-white rounded-xl hover:bg-[#2d6b1f] flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PlusOutlined /> New Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Section */}
                <div className="mb-8">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
                        <p className="text-sm text-gray-600">Key metrics and statistics</p>
                    </div>
                    <BookingStats bookings={bookings} payments={payments} />
                </div>

                {/* Enhanced Bookings Table Section */}
                <div className="mb-6">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">All Bookings</h2>
                        <p className="text-sm text-gray-600">Complete list of field reservations</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <BookingTable bookings={bookings} setRefresh={handleRefresh}/>
                    </div>
                </div>

            </div>
        </div>

            {/* New Booking Modal */}
            <NewBookingModal
                isOpen={isNewBookingModalOpen}
                onClose={() => setIsNewBookingModalOpen(false)}
                onSuccess={handleRefresh}
            />
        </div>
    )
}
