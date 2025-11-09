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
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 min-w-[120px]">
                    <button 
                        onClick={() => handleEditStatus(item)} 
                        className='px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm border border-gray-300 rounded-md sm:rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap'
                    >
                        View
                    </button>
                    <button 
                        onClick={() => handleDeleteUser(item)} 
                        className='px-2 sm:px-3 py-1.5 sm:py-1 text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap'
                    >
                        Delete
                    </button>
                </div>
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
        // Logic to edit user details
        console.log('Editing user:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const handleDeleteUser = (item: UserType) => {
        // Logic to delete user
        if (window.confirm(`Are you sure you want to delete user ${item.first_name}?`)) {
            console.log('Deleting user:', item)
            // TODO: Implement user deletion logic
            alert('Delete user functionality to be implemented')
        }
    }

    const data = users.map((item) => {
        return {
            id: item._id,
            names: item.first_name,
            email: item.email,
            phone: item.phone_number,
            activity: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'N/A',
            joined: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : 'N/A',
        }
    })

    return (
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100">
            {/* Enhanced Table Header */}
            <div className="p-4 md:p-6 border-b border-gray-100">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">All Users</h3>
                            <p className="text-gray-600 text-sm mt-1">Manage user accounts and profiles</p>
                        </div>
                        <div className="text-sm text-gray-500">
                            {data.length} users found
                        </div>
                    </div>
                    
                    {/* Mobile Search - Show on smaller screens */}
                    <div className="md:hidden">
                        <div className="relative">
                            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile-Optimized Table */}
            <div className="overflow-hidden">
                <div className="overflow-x-auto">
                    <SimpleTable 
                        data={data} 
                        columns={columns} 
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            
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
