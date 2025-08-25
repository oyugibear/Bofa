"use client"

import { BookingDetails, UserType } from '@/types'
import React, { useState } from 'react' 
import { PiUser } from 'react-icons/pi'
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import UserModal from '@/components/constants/Modals/UserModal'
// import BookingModal from '../constants/Modals/BookingModal'

export default function UserTable({users, setRefresh} : {users: UserType[], setRefresh: () => void}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState ('all')

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<UserType | null>(null);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'names',
            key: 'names',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Activity',
            dataIndex: 'activity',
            key: 'activity',
        },
        {
            title: 'Joined',
            dataIndex: 'joined',
            key: 'joined',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <button onClick={() => handleEditStatus(item)} className='p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                    View
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

    const handleEditStatus = (item: UserType) => {
        // Logic to edit booking status
        console.log('Editing status for:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const data = users.map((item) => {
        return {
            id: item._id,
            names: item.first_name,
            email: item.email,
            phone: item.phone_number,
            activity: item.updatedAt,
            joined: item.createdAt,
        }
    })

    return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
                        <p className="text-gray-600 text-sm mt-1">Manage user accounts and profiles</p>
                    </div>
                    
                </div>
            </div>

            {/* Table */}
            <SimpleTable data={data} columns={columns} scroll={{ x: 1000 }}/>
            
            {/* Modal for Editing Status */}
            {isModalOpen && (
                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    setRefresh={setRefresh}
                    item={selectedItem}
                />
            )}
        </div>
    )
}
