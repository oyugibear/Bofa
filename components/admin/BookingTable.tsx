"use client"

import { BookingDetails, UserProfile } from '@/types'
import React, { useState } from 'react' 
import { PiUser } from 'react-icons/pi'
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import BookingModal from '../constants/Modals/BookingModal'

export default function BookingTable({bookings, setRefresh} : {bookings: BookingDetails[], setRefresh: () => void}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState ('all')

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BookingDetails | null>(null);

    const columns = [
        {
            title: 'Client',
            dataIndex: 'client',
            key: 'client',
            render: (client : any) => (
                <div className='flex items-center gap-2'>
                    <PiUser size={16} className='text-gray-400' />
                    <span className='text-gray-900'>
                        {`${client?.first_name || ''} ${client?.second_name || ''}`.trim() || 'Unknown Client'}
                    </span>
                </div>
            ),
            sorter: (a: any, b: any) => {
                const nameA = `${a.client?.first_name || ''} ${a.client?.second_name || ''}`.trim()
                const nameB = `${b.client?.first_name || ''} ${b.client?.second_name || ''}`.trim()
                return nameA.localeCompare(nameB)
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Booking Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Booking Time',
            dataIndex: 'time',
            key: 'time',
            sorter: (a: any, b: any) => {
                // Handle time comparison safely
                if (!a.time || !b.time) return 0
                
                // Extract hours and minutes for comparison
                const [hoursA, minutesA] = a.time.split(':').map(Number)
                const [hoursB, minutesB] = b.time.split(':').map(Number)
                
                const totalMinutesA = hoursA * 60 + (minutesA || 0)
                const totalMinutesB = hoursB * 60 + (minutesB || 0)
                
                return totalMinutesA - totalMinutesB
            },
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Duration (hrs)',
            dataIndex: 'duration',
            key: 'duration',
            sorter: (a: any, b: any) => parseInt(a.duration) - parseInt(b.duration),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Booking Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a: any, b: any) => a.status.localeCompare(b.status),
            sortDirections: ['descend', 'ascend'],
            filters: [
                { text: 'Confirmed', value: 'confirmed' },
                { text: 'Pending', value: 'pending' },
                { text: 'Cancelled', value: 'cancelled' },
                { text: 'Completed', value: 'completed' },
            ],
            onFilter: (value: any, record: any) => record.status === value,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <button 
                    onClick={() => handleEditStatus(item)} 
                    className='px-3 py-2 text-sm font-medium text-[#3A8726FF] border border-[#3A8726FF] border-opacity-20 rounded-lg hover:bg-[#3A8726FF] hover:bg-opacity-10 transition-all duration-200 flex items-center gap-1'
                >
                    <span>Edit Status</span>
                </button>
            ),
        },
    ]

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleEditStatus = (item: BookingDetails) => {
        // Logic to edit booking status
        console.log('Editing status for:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    // Sort bookings by creation date (latest first) and apply filters
    const filteredAndSortedBookings = bookings
        .sort((a, b) => new Date(b.createdAt || b._id).getTime() - new Date(a.createdAt || a._id).getTime())
        .filter((item) => {
            // Status filter
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false
            }
            
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase()
                const clientName = `${item.client?.first_name || ''} ${item.client?.second_name || ''}`.toLowerCase()
                const date = item.date_requested?.toLowerCase() || ''
                const time = item.time?.toLowerCase() || ''
                const status = item.status?.toLowerCase() || ''
                
                return clientName.includes(searchLower) || 
                       date.includes(searchLower) || 
                       time.includes(searchLower) || 
                       status.includes(searchLower)
            }
            
            return true
        })

    const data = filteredAndSortedBookings.map((item) => {
        return {
            id: item._id,
            client: item.client,
            date: item.date_requested,
            time: item.time,
            duration: item.duration,
            amount: item.amount,
            status: item.status,
            paymentStatus: item.payment_status,
            
        }
    })

    return (
            <>
            {/* Enhanced Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-[#3A8726FF] rounded-full"></div>
                            <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
                        </div>
                        <p className="text-gray-600 text-sm">
                            Showing <span className="font-semibold text-[#3A8726FF]">{filteredAndSortedBookings.length}</span> of <span className="font-semibold">{bookings.length}</span> bookings
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent w-full sm:w-64 transition-all duration-200"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent transition-all duration-200 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-hidden">
                <SimpleTable data={data} columns={columns} scroll={{ x: 1000 }}/>
            </div>
            
            {/* Modal for Editing Status */}
            {isModalOpen && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    setRefresh={setRefresh}
                    item={selectedItem}
                />
            )}
        </>
    )
}
