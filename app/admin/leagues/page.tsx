'use client'

import React, { useState } from 'react'
import { 
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  StarOutlined,
  CrownOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'

// Stats Component for Leagues
const LeagueStats = () => {
  const stats = [
    { 
      title: 'Active Leagues', 
      value: '6', 
      icon: <TrophyOutlined />, 
      color: 'text-blue-600', 
      change: '+2',
      subtitle: 'Currently running'
    },
    { 
      title: 'Total Teams', 
      value: '48', 
      icon: <TeamOutlined />, 
      color: 'text-green-600', 
      change: '+8',
      subtitle: 'Participating teams'
    },
    { 
      title: 'Prize Pool', 
      value: 'KSh 2.5M', 
      icon: <DollarOutlined />, 
      color: 'text-purple-600', 
      change: '+25%',
      subtitle: 'Total this season'
    },
    { 
      title: 'Matches Played', 
      value: '142', 
      icon: <CalendarOutlined />, 
      color: 'text-orange-600', 
      change: '+30',
      subtitle: 'This season'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from last season
              </p>
            </div>
            <div className={`${stat.color} text-2xl`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Leagues Table Component
const LeaguesTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const leagues = [
    { 
      id: 'L001', 
      name: 'Premier League', 
      season: '2025',
      teams: 16,
      status: 'Active', 
      startDate: '2025-01-15',
      endDate: '2025-12-15',
      prizePool: 500000,
      registrationFee: 15000,
      matchesPlayed: 45,
      totalMatches: 120,
      currentLeader: 'Arsenal FC',
      description: 'Top tier professional league'
    },
    { 
      id: 'L002', 
      name: 'Champions League', 
      season: '2025',
      teams: 12,
      status: 'Active', 
      startDate: '2025-02-01',
      endDate: '2025-11-30',
      prizePool: 750000,
      registrationFee: 25000,
      matchesPlayed: 32,
      totalMatches: 66,
      currentLeader: 'Chelsea United',
      description: 'Elite championship competition'
    },
    { 
      id: 'L003', 
      name: 'Youth League', 
      season: '2025',
      teams: 8,
      status: 'Upcoming', 
      startDate: '2025-09-01',
      endDate: '2025-12-20',
      prizePool: 200000,
      registrationFee: 8000,
      matchesPlayed: 0,
      totalMatches: 28,
      currentLeader: 'TBD',
      description: 'Under-18 development league'
    },
    { 
      id: 'L004', 
      name: 'Women\'s League', 
      season: '2025',
      teams: 10,
      status: 'Active', 
      startDate: '2025-03-01',
      endDate: '2025-10-31',
      prizePool: 300000,
      registrationFee: 12000,
      matchesPlayed: 28,
      totalMatches: 45,
      currentLeader: 'Lionesses FC',
      description: 'Professional women\'s competition'
    },
    { 
      id: 'L005', 
      name: 'Corporate League', 
      season: '2025',
      teams: 6,
      status: 'Finished', 
      startDate: '2025-01-10',
      endDate: '2025-06-30',
      prizePool: 150000,
      registrationFee: 20000,
      matchesPlayed: 15,
      totalMatches: 15,
      currentLeader: 'Tech United FC',
      description: 'Inter-company tournament'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Upcoming': return 'bg-blue-100 text-blue-800'
      case 'Finished': return 'bg-gray-100 text-gray-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (played: number, total: number) => {
    return total > 0 ? Math.round((played / total) * 100) : 0
  }

  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         league.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || league.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">All Leagues</h3>
            <p className="text-gray-600 text-sm mt-1">Manage tournaments and competitions</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leagues..."
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
              <option value="active">Active</option>
              <option value="upcoming">Upcoming</option>
              <option value="finished">Finished</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
              <PlusOutlined /> Create League
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teams & Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Pool</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leader</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeagues.map((league) => (
              <tr key={league.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-full flex items-center justify-center">
                      <TrophyOutlined />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{league.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{league.id}</div>
                      <div className="text-xs text-gray-400">{league.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TeamOutlined className="text-gray-400 text-xs" />
                      <span className="text-sm font-medium text-gray-900">{league.teams} teams</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(league.status)}`}>
                      {league.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {new Date(league.startDate).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {new Date(league.endDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">Season {league.season}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">
                      {league.matchesPlayed}/{league.totalMatches} matches
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-[#3A8726FF] h-2 rounded-full" 
                        style={{ width: `${getProgressPercentage(league.matchesPlayed, league.totalMatches)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getProgressPercentage(league.matchesPlayed, league.totalMatches)}% complete
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      KSh {league.prizePool.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Entry: KSh {league.registrationFee.toLocaleString()}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {league.currentLeader !== 'TBD' && (
                      <CrownOutlined className="text-yellow-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{league.currentLeader}</div>
                      {league.status === 'Active' && league.currentLeader !== 'TBD' && (
                        <div className="text-xs text-gray-500">Current leader</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View League">
                      <EyeOutlined />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Edit League">
                      <EditOutlined />
                    </button>
                    <button className="text-purple-600 hover:text-purple-800" title="View Standings">
                      <StarOutlined />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="Delete League">
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredLeagues.length}</span> of{' '}
          <span className="font-medium">{leagues.length}</span> results
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
          <button className="px-3 py-1 text-sm bg-[#3A8726FF] text-white rounded">1</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
        </div>
      </div>
    </div>
  )
}

// Main Leagues Page Component
export default function LeaguesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col'>
        {/* Top Header for Mobile */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
          <h1 className="text-xl font-bold text-gray-800">Leagues</h1>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
          {/* Page Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Leagues</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">League Management</h1>
                <p className="text-gray-600 mt-1">Manage tournaments and competitions</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <DownloadOutlined /> Export
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                  <PlusOutlined /> Create League
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <LeagueStats />

          {/* Leagues Table */}
          <LeaguesTable />
        </div>
      </div>
    </div>
  )
}
