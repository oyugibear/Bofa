"use client"

import {  TeamTypes } from '@/types'
import React, { useState, useMemo } from 'react' 
import { PiUser } from 'react-icons/pi'
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'
import BookingModal from '../../constants/Modals/BookingModal'
import PaymentModal from '../Modals/PaymentModal'
import { BsEye } from 'react-icons/bs'
import { Select, Input, DatePicker, Skeleton } from 'antd'
import Link from 'next/link'

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function TeamTable({teams, setRefresh, loading = false} : {teams: TeamTypes[], setRefresh: () => void, loading?: boolean}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [amountFilter, setAmountFilter] = useState('all')
    const [dateRange, setDateRange] = useState<[any, any] | null>(null)
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [tableReady, setTableReady] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TeamTypes | null>(null);

    // Mark table as ready when teams data changes and filtering is complete
    React.useEffect(() => {
        if (teams) {
            // Small delay to ensure table has rendered
            const timer = setTimeout(() => {
                setTableReady(true)
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [teams])

    const columns = [
        {
            title: 'Team Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Leagues & Status',
            dataIndex: 'leagues',
            key: 'leagues',
        },
        {
            title: 'Performance',
            dataIndex: 'performance',
            key: 'performance',
        },
        {
            title: 'Members',
            dataIndex: 'members',
            key: 'members',
            render: (players: any) => (
                <div className='flex items-center gap-2'>
                    <PiUser size={16} className='text-gray-400' />
                    <span className='text-gray-900'>
                       {players}
                    </span>
                </div>
            ),
        },
        {
            title: 'Matches Played',
            dataIndex: 'matches',
            key: 'matches'
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <div className='flex gap-2'>
                    <Link href={`/admin/teams/${item.id}`} className='text-black'>
                        <button className='px-2 flex flex-row gap-2 items-center py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-100 transition-colors'>
                            View
                            <BsEye />
                        </button>
                    </Link>
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

    const handleEditStatus = (item: TeamTypes) => {
        // Logic to edit booking status
        console.log('Editing status for:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    console.log("Teams data:", teams)
    const data = teams.map((item) => {
        return {
            id: item._id,
            name: item.name,
            matches: item?.matches?.length || 0,
            members: item?.members?.length || 0,
            points: item.points,
            coach: item.coach
        }
    })


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All teams</h3>
                        <p className="text-gray-600 text-sm mt-1">Manage field teams and reservations</p>
                    </div>
                </div>
                
                {loading ? (
                    <div className="mt-4 space-y-4">
                        <Skeleton.Input active size="large" className="w-full" />
                        <div className="flex gap-2">
                            <Skeleton.Input active className="w-32" />
                            <Skeleton.Input active className="w-32" />
                            <Skeleton.Input active className="w-64" />
                            <Skeleton.Input active className="w-40" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Filters and Search */}
                        <div className="mt-4 flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by client name or Team ID..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                        </div>
                        
                        {/* Results Summary */}
                        <div className="mt-3 text-sm text-gray-600">
                            {/* Showing {filteredAndSortedData.length} of {data.length} teams */}
                        </div>
                    </>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div className="p-6">
                    <Skeleton active paragraph={{ rows: 8 }} />
                </div>
            ) : (
                <SimpleTable data={data} columns={columns} scroll={{ x: 1000 }}/>
            )}
            
            {/* Modal for Editing Status */}
            {isModalOpen && (
                <PaymentModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    setRefresh={setRefresh}
                    item={selectedItem}
                    type="View"
                />
            )}
        </div>
    )
}
