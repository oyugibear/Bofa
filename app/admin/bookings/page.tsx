'use client'

import React, { useEffect, useState } from 'react'
import { 
  PlusOutlined,
  DownloadOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import { Booking, Payment, BookingDetails } from '@/types'
import { bookingAPI, paymentAPI } from '@/utils/api'
import StatCard from '@/components/admin/StatCard'
import BookingStats from '@/components/admin/BookingStats'
import BookingTable from '@/components/admin/BookingTable'
import BookingCalendar from '@/components/admin/BookingCalendar'


// Bookings Table Component


// Main Bookings Page Component
export default function BookingsPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const [bookings, setBookings] = useState<BookingDetails[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

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

    

    return (
        <div className='flex min-h-screen bg-gray-50'>
        <SideMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className='flex-1 flex flex-col'>
            {/* Top Header for Mobile */}
            <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
            <h1 className="text-xl font-bold text-gray-800">Bookings</h1>
            </div>
            
            {/* Main Content */}
            <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
            {/* Page Header */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Bookings</span>
                    </nav>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                            <p className="text-gray-600 mt-1">Manage field bookings and reservations</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                            <DownloadOutlined /> Export
                            </button>
                            <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                            <PlusOutlined /> New Booking
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <BookingStats bookings={bookings} payments={payments} />

                {/* Booking Calendar */}
                {/* <BookingCalendar bookings={bookings} /> */}

                {/* Bookings Table */}
                <BookingTable bookings={bookings} setRefresh={handleRefresh}/>

                </div>
            </div>
        </div>
    )
}
