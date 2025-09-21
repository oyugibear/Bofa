"use client"

import { Payment, UserProfile } from '@/types'
import React, { useState, useMemo } from 'react' 
import { PiUser } from 'react-icons/pi'
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, PlusOutlined, DownloadOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons'
import BookingModal from '../../constants/Modals/BookingModal'
import PaymentModal from '../Modals/PaymentModal'
import { BsEye } from 'react-icons/bs'
import { Select, Input, DatePicker, Skeleton } from 'antd'

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function PaymentsTable({payments, setRefresh, loading = false} : {payments: Payment[], setRefresh: () => void, loading?: boolean}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [amountFilter, setAmountFilter] = useState('all')
    const [dateRange, setDateRange] = useState<[any, any] | null>(null)
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [tableReady, setTableReady] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Payment | null>(null);

    // Mark table as ready when payments data changes and filtering is complete
    React.useEffect(() => {
        if (payments) {
            // Small delay to ensure table has rendered
            const timer = setTimeout(() => {
                setTableReady(true)
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [payments])

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
            title: 'Payment Date',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Payment Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <div className='flex gap-2'>
                    {/* <button onClick={() => handleEditStatus(item)} className='px-2 py-1 border flex gap-2 bg-[#003D65] text-white border-gray-300 rounded-lg hover:bg-gray-100 transition-colors'>
                        Receipt
                        <DownloadOutlined />
                    </button> */}
                    <button onClick={() => handleEditStatus(item)} className='px-2 flex flex-row gap-2 items-center py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-100 transition-colors'>
                        View
                        <BsEye />
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

    const handleEditStatus = (item: Payment) => {
        // Logic to edit booking status
        console.log('Editing status for:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const data = payments.map((item) => {
        return {
            id: item._id,
            client: item.postedBy,
            date: item.booking_id?.date_requested,
            time: item.booking_id?.time,
            duration: item.booking_id?.duration,
            amount: item.final_amount_invoiced,
            status: item.status,
            paymentStatus: item.payment_status,
            paymentDate: item.payment_date,
            paymentMethod: item.payment_method,
            clientName: `${(item.postedBy as any)?.first_name || ''} ${(item.postedBy as any)?.second_name || ''}`.trim(),
        }
    })

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(item => {
            // Search filter
            const searchMatch = searchTerm === '' || 
                item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.id.toLowerCase().includes(searchTerm.toLowerCase())

            // Status filter
            const statusMatch = statusFilter === 'all' || item.paymentStatus === statusFilter

            // Amount filter
            const amountMatch = amountFilter === 'all' || 
                (amountFilter === 'low' && item.amount < 1000) ||
                (amountFilter === 'medium' && item.amount >= 1000 && item.amount < 5000) ||
                (amountFilter === 'high' && item.amount >= 5000)

            // Date range filter
            const dateMatch = !dateRange || 
                (item.paymentDate && 
                 new Date(item.paymentDate) >= new Date(dateRange[0]) && 
                 new Date(item.paymentDate) <= new Date(dateRange[1]))

            return searchMatch && statusMatch && amountMatch && dateMatch
        })

        // Sort data
        filtered.sort((a, b) => {
            let aValue, bValue

            switch (sortBy) {
                case 'date':
                    aValue = new Date(a.paymentDate || 0).getTime()
                    bValue = new Date(b.paymentDate || 0).getTime()
                    break
                case 'amount':
                    aValue = a.amount || 0
                    bValue = b.amount || 0
                    break
                case 'client':
                    aValue = a.clientName.toLowerCase()
                    bValue = b.clientName.toLowerCase()
                    break
                case 'status':
                    aValue = a.paymentStatus || ''
                    bValue = b.paymentStatus || ''
                    break
                default:
                    return 0
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [data, searchTerm, statusFilter, amountFilter, dateRange, sortBy, sortOrder]) 

    return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All payments</h3>
                        <p className="text-gray-600 text-sm mt-1">Manage field payments and reservations</p>
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
                                    placeholder="Search by client name or payment ID..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                                <Select
                                    value={statusFilter}
                                    onChange={setStatusFilter}
                                    className="w-32"
                                    placeholder="Status"
                                >
                                    <Option value="all">All Status</Option>
                                    <Option value="paid">Paid</Option>
                                    <Option value="pending">Pending</Option>
                                    <Option value="failed">Failed</Option>
                                </Select>
                                
                                <Select
                                    value={amountFilter}
                                    onChange={setAmountFilter}
                                    className="w-32"
                                    placeholder="Amount"
                                >
                                    <Option value="all">All Amounts</Option>
                                    <Option value="low">&lt; $1,000</Option>
                                    <Option value="medium">$1,000 - $5,000</Option>
                                    <Option value="high">&gt; $5,000</Option>
                                </Select>
                                
                                <RangePicker
                                    onChange={(dates) => setDateRange(dates)}
                                    className="w-64"
                                    placeholder={['Start Date', 'End Date']}
                                />
                                
                                <Select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(value) => {
                                        const [sort, order] = value.split('-')
                                        setSortBy(sort)
                                        setSortOrder(order as 'asc' | 'desc')
                                    }}
                                    className="w-40"
                                    placeholder="Sort by"
                                >
                                    <Option value="date-desc">Latest First</Option>
                                    <Option value="date-asc">Oldest First</Option>
                                    <Option value="amount-desc">Highest Amount</Option>
                                    <Option value="amount-asc">Lowest Amount</Option>
                                    <Option value="client-asc">Client A-Z</Option>
                                    <Option value="client-desc">Client Z-A</Option>
                                    <Option value="status-asc">Status A-Z</Option>
                                </Select>
                            </div>
                        </div>
                        
                        {/* Results Summary */}
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredAndSortedData.length} of {data.length} payments
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
                <SimpleTable data={filteredAndSortedData} columns={columns} scroll={{ x: 1000 }}/>
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
