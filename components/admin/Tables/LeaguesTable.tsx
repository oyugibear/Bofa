"use client"

import { League } from '@/types'
import React, { useState, useMemo } from 'react' 
import SimpleTable from '@/components/constants/tables/SimpleTable'
import { SearchOutlined, TrophyOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import { BsEye, BsPeople, BsTrophy } from 'react-icons/bs'
import { Select, Input, DatePicker, Skeleton, Tag, Badge } from 'antd'
import Link from 'next/link'

const { RangePicker } = DatePicker;
const { Option } = Select;

export default function LeaguesTable({leagues, setRefresh, loading = false} : {leagues: League[], setRefresh: () => void, loading?: boolean}) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [dateRange, setDateRange] = useState<[any, any] | null>(null)
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [tableReady, setTableReady] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<League | null>(null);

    // Mark table as ready when leagues data changes and filtering is complete
    React.useEffect(() => {
        if (leagues) {
            // Small delay to ensure table has rendered
            const timer = setTimeout(() => {
                setTableReady(true)
            }, 50)
            return () => clearTimeout(timer)
        }
    }, [leagues])

    // Helper functions
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'adult': return 'blue'
            case 'youth': return 'green'
            case 'women': return 'pink'
            case 'veterans': return 'purple'
            default: return 'default'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active': return 'success'
            case 'upcoming': return 'processing'
            case 'finished': return 'default'
            default: return 'default'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'text-green-600'
            case 'upcoming': return 'text-blue-600'
            case 'finished': return 'text-gray-600'
            default: return 'text-gray-600'
        }
    }

    const columns = [
        {
            title: 'League',
            dataIndex: 'name',
            key: 'league',
            render: (name: string, record: any) => (
                <div className='flex items-center gap-3'>
                    
                    <div>
                        <div className='text-gray-900 font-medium'>{name}</div>
                        <div className='text-xs text-gray-500'>{record.season} Season</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Teams',
            dataIndex: 'teams',
            key: 'teams',
            render: (teams: number) => (
                <div className='flex items-center gap-1'>
                    <TeamOutlined className='text-gray-500' />
                    <span className='text-gray-900 font-medium'>{teams}</span>
                    <span className='text-gray-500 text-sm'>teams</span>
                </div>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category: string, record: any) => (
                <div>
                    <Tag color={getCategoryColor(category)} className='capitalize'>
                        {category}
                    </Tag>
                    <Tag color="green" className='capitalize'>
                        {record.level}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Schedule',
            dataIndex: 'startDate',
            key: 'schedule',
            render: (startDate: string, record: any) => (
                <div className='flex items-center gap-1'>
                    <div>
                        <div className='text-gray-900 text-sm'>{formatDate(startDate)}</div>
                        <div className='text-xs text-gray-500'>to {formatDate(record.endDate)}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Prize Pool',
            dataIndex: 'prizePool',
            key: 'prizePool',
            render: (prizePool: number) => (
                <div className='text-green-600 font-semibold'>
                    KSh {prizePool.toLocaleString()}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Badge 
                    status={getStatusBadge(status)} 
                    text={
                        <span className={`capitalize ${getStatusColor(status)}`}>
                            {status}
                        </span>
                    } 
                />
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <div className='flex gap-2'>
                    <Link href={`/admin/leagues/${item.id}`}>
                        <button 
                            onClick={() => handleViewLeague(item)} 
                            className='px-3 py-1 cursor-pointer flex items-center gap-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            <BsEye />
                            View
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

    const handleViewLeague = (item: League) => {
        // Logic to view league details
        console.log('Viewing league:', item)
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const data = leagues.map((item) => {
        return {
            key: item._id,
            id: item._id,
            name: item.title,
            description: item.description,
            season: item.season,
            status: item.status,
            teams: item.numberOfTeams,
            matches: item.matches,
            startDate: item.startDate,
            endDate: item.endDate,
            prizePool: item.prizePool,
            registrationFee: item.registrationFee,
            category: item.category,
            level: item.level,
        }
    })

    // Filter and sort data
    const filteredAndSortedData = useMemo(() => {
        let filtered = data.filter(item => {
            // Search filter
            const searchMatch = searchTerm === '' || 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())

            // Status filter
            const statusMatch = statusFilter === 'all' || item.status === statusFilter

            // Category filter
            const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter

            // Date range filter
            const dateMatch = !dateRange || 
                (new Date(item.startDate) >= new Date(dateRange[0]) && 
                 new Date(item.endDate) <= new Date(dateRange[1]))

            return searchMatch && statusMatch && categoryMatch && dateMatch
        })

        // Sort data
        filtered.sort((a, b) => {
            let aValue, bValue

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase()
                    bValue = b.name.toLowerCase()
                    break
                case 'startDate':
                    aValue = new Date(a.startDate).getTime()
                    bValue = new Date(b.startDate).getTime()
                    break
                case 'prizePool':
                    aValue = a.prizePool || 0
                    bValue = b.prizePool || 0
                    break
                case 'teams':
                    aValue = a.teams || 0
                    bValue = b.teams || 0
                    break
                case 'status':
                    aValue = a.status || ''
                    bValue = b.status || ''
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
    }, [data, searchTerm, statusFilter, categoryFilter, dateRange, sortBy, sortOrder]) 

    return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">All Leagues</h3>
                        <p className="text-gray-600 text-sm mt-1">Manage league competitions and tournaments</p>
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
                                    placeholder="Search by league name, description, or category..."
                                    prefix={<SearchOutlined />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            
                            
                        </div>
                        
                        {/* Results Summary */}
                        <div className="mt-3 text-sm text-gray-600">
                            Showing {filteredAndSortedData.length} of {data.length} leagues
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
            
            {/* Modal for Viewing League Details - placeholder for future implementation */}
            {/* {isModalOpen && (
                <LeagueModal
                    isOpen={isModalOpen}
                    onClose={handleCancel}
                    setRefresh={setRefresh}
                    item={selectedItem}
                    type="View"
                />
            )} */}
        </div>
    )
}
