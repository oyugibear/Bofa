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
        },
        {
            title: 'Booking Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Booking Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Duration (hrs)',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Booking Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <button onClick={() => handleEditStatus(item)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                    Edit Status
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

    const data = bookings.map((item) => {
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
                        <p className="text-gray-600 text-sm mt-1">Manage field bookings and reservations</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                        <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
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
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                        </select>
                        <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                        <PlusOutlined /> New Booking
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <SimpleTable data={data} columns={columns} scroll={{ x: 1000 }}/>
            
            {/* Modal for Editing Status */}
            {isModalOpen && (
                <BookingModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    setRefresh={setRefresh}
                    item={selectedItem}
                />
            )}
        </div>
    )
}
