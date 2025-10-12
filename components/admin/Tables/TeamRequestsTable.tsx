"use client"

import React, { useState, useMemo } from 'react' 
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined, UserOutlined, CalendarOutlined } from '@ant-design/icons'
import { Select, Input, DatePicker, Skeleton, Tag, Button, message, Popconfirm } from 'antd'

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TeamRegistrant {
  _id: string
  teamName: string
  captainName: string
  captainEmail: string
  captainPhone: string
  category: string
  level: string
  expectedMembers: number
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected'
  preferredLeagues?: string[]
  description?: string
}

export default function TeamRequestsTable({
  registrants, 
  setRefresh, 
  loading = false
} : {
  registrants: TeamRegistrant[], 
  setRefresh: () => void, 
  loading?: boolean
}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [dateRange, setDateRange] = useState<[any, any] | null>(null)
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [selectedItem, setSelectedItem] = useState<TeamRegistrant | null>(null)

    // Handle approve/reject actions
    const handleApprove = async (registrant: TeamRegistrant) => {
        try {
            // Here you would call your API to approve the team registration
            message.success(`Team "${registrant.teamName}" has been approved!`)
            setRefresh()
        } catch (error) {
            message.error('Failed to approve team registration')
        }
    }

    const handleReject = async (registrant: TeamRegistrant) => {
        try {
            // Here you would call your API to reject the team registration
            message.success(`Team "${registrant.teamName}" has been rejected`)
            setRefresh()
        } catch (error) {
            message.error('Failed to reject team registration')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green'
            case 'rejected': return 'red'
            case 'pending': return 'orange'
            default: return 'default'
        }
    }

    const columns = [
        {
            title: 'Team Information',
            key: 'teamInfo',
            render: (record: TeamRegistrant) => (
                <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{record.teamName}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                        <UserOutlined className="text-gray-400" />
                        {record.captainName}
                    </div>
                </div>
            ),
        },
        {
            title: 'Contact Details',
            key: 'contact',
            render: (record: TeamRegistrant) => (
                <div className="space-y-1">
                    <div className="text-sm text-gray-900">{record.captainEmail}</div>
                    <div className="text-sm text-gray-600">{record.captainPhone}</div>
                </div>
            ),
        },
        {
            title: 'Category & Level',
            key: 'category',
            render: (record: TeamRegistrant) => (
                <div className="space-y-1">
                    <Tag color="blue">{record.category}</Tag>
                    <Tag color="purple">{record.level}</Tag>
                </div>
            ),
        },
        {
            title: 'Expected Members',
            dataIndex: 'expectedMembers',
            key: 'expectedMembers',
            render: (count: number) => (
                <div className="flex items-center gap-1">
                    <UserOutlined className="text-gray-400" />
                    <span>{count} players</span>
                </div>
            ),
        },
        {
            title: 'Registration Date',
            dataIndex: 'registrationDate',
            key: 'registrationDate',
            render: (date: string) => (
                <div className="flex items-center gap-1">
                    <CalendarOutlined className="text-gray-400" />
                    <span>{new Date(date).toLocaleDateString()}</span>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: TeamRegistrant) => (
                <div className="flex gap-2">
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedItem(record)}
                        title="View Details"
                    >
                        View
                    </Button>
                    {record.status === 'pending' && (
                        <>
                            <Popconfirm
                                title="Approve this team registration?"
                                description="This will create a new team and notify the captain."
                                onConfirm={() => handleApprove(record)}
                                okText="Yes, Approve"
                                cancelText="Cancel"
                            >
                                <Button
                                    size="small"
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Approve
                                </Button>
                            </Popconfirm>
                            <Popconfirm
                                title="Reject this team registration?"
                                description="This action will notify the captain of rejection."
                                onConfirm={() => handleReject(record)}
                                okText="Yes, Reject"
                                cancelText="Cancel"
                                okButtonProps={{ danger: true }}
                            >
                                <Button
                                    size="small"
                                    danger
                                    icon={<CloseOutlined />}
                                >
                                    Reject
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </div>
            ),
        },
    ]

    // Filter and search functionality
    const filteredRegistrants = useMemo(() => {
        return registrants.filter(registrant => {
            const matchesSearch = searchTerm === '' || 
                registrant.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                registrant.captainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                registrant.captainEmail.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesStatus = statusFilter === 'all' || registrant.status === statusFilter
            const matchesCategory = categoryFilter === 'all' || registrant.category === categoryFilter
            
            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [registrants, searchTerm, statusFilter, categoryFilter])

    // Get stats for display
    const stats = useMemo(() => {
        return {
            total: registrants.length,
            pending: registrants.filter(r => r.status === 'pending').length,
            approved: registrants.filter(r => r.status === 'approved').length,
            rejected: registrants.filter(r => r.status === 'rejected').length,
        }
    }, [registrants])


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Team Registration Requests</h3>
                        <p className="text-gray-600 text-sm mt-1">Review and approve new team registrations</p>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div className="bg-orange-50 px-3 py-1 rounded-full">
                            <span className="text-orange-600 font-medium">{stats.pending} Pending</span>
                        </div>
                        <div className="bg-green-50 px-3 py-1 rounded-full">
                            <span className="text-green-600 font-medium">{stats.approved} Approved</span>
                        </div>
                        <div className="bg-red-50 px-3 py-1 rounded-full">
                            <span className="text-red-600 font-medium">{stats.rejected} Rejected</span>
                        </div>
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
                                    placeholder="Search by team name, captain name, or email..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            <Select
                                placeholder="Filter by Status"
                                value={statusFilter}
                                onChange={setStatusFilter}
                                className="w-40"
                            >
                                <Option value="all">All Status</Option>
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                            </Select>

                            <Select
                                placeholder="Filter by Category"
                                value={categoryFilter}
                                onChange={setCategoryFilter}
                                className="w-40"
                            >
                                <Option value="all">All Categories</Option>
                                <Option value="Youth">Youth</Option>
                                <Option value="Adult">Adult</Option>
                                <Option value="Women">Women</Option>
                                <Option value="Veteran">Veteran</Option>
                            </Select>
                        </div>
                        
                        {/* Results Summary */}
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredRegistrants.length} of {stats.total} team registration requests
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
                <SimpleTable 
                    data={filteredRegistrants} 
                    columns={columns} 
                    scroll={{ x: 1200 }}
                />
            )}
            
            {/* Team Details Modal */}
            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Team Registration Details</h3>
                            <Button onClick={() => setSelectedItem(null)}>Close</Button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Team Name</label>
                                    <p className="text-gray-900">{selectedItem.teamName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <div>
                                        <Tag color={getStatusColor(selectedItem.status)} className="capitalize">
                                            {selectedItem.status}
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Captain Name</label>
                                    <p className="text-gray-900">{selectedItem.captainName}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Expected Members</label>
                                    <p className="text-gray-900">{selectedItem.expectedMembers} players</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-gray-900">{selectedItem.captainEmail}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <p className="text-gray-900">{selectedItem.captainPhone}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Category</label>
                                    <p className="text-gray-900">{selectedItem.category}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Level</label>
                                    <p className="text-gray-900">{selectedItem.level}</p>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-sm font-medium text-gray-700">Registration Date</label>
                                <p className="text-gray-900">{new Date(selectedItem.registrationDate).toLocaleString()}</p>
                            </div>
                            
                            {selectedItem.preferredLeagues && selectedItem.preferredLeagues.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Preferred Leagues</label>
                                    <div className="flex gap-2 mt-1">
                                        {selectedItem.preferredLeagues.map((league, index) => (
                                            <Tag key={index} color="blue">{league}</Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {selectedItem.description && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <p className="text-gray-900 bg-gray-50 p-3 rounded">{selectedItem.description}</p>
                                </div>
                            )}
                            
                            {selectedItem.status === 'pending' && (
                                <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => {
                                            handleApprove(selectedItem)
                                            setSelectedItem(null)
                                        }}
                                    >
                                        Approve Registration
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseOutlined />}
                                        onClick={() => {
                                            handleReject(selectedItem)
                                            setSelectedItem(null)
                                        }}
                                    >
                                        Reject Registration
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
