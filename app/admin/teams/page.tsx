'use client'

import React, { useState } from 'react'
import { 
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  StarOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  DownloadOutlined,
  CalendarOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'

// Stats Component for Teams
const TeamStats = () => {
  const stats = [
    { 
      title: 'Total Teams', 
      value: '24', 
      icon: <TeamOutlined />, 
      color: 'text-blue-600', 
      change: '+3%',
      subtitle: 'Registered teams'
    },
    { 
      title: 'Active Teams', 
      value: '18', 
      icon: <StarOutlined />, 
      color: 'text-green-600', 
      change: '+2',
      subtitle: 'Currently playing'
    },
    { 
      title: 'Total Players', 
      value: '432', 
      icon: <UserOutlined />, 
      color: 'text-purple-600', 
      change: '+15%',
      subtitle: 'Across all teams'
    },
    { 
      title: 'Championships', 
      value: '6', 
      icon: <TrophyOutlined />, 
      color: 'text-orange-600', 
      change: '+1',
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
                {stat.change} from last month
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

// Teams Table Component
const TeamsTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const teams = [
    { 
      id: 'T001', 
      name: 'Arsenal FC', 
      coach: 'John Smith',
      coachEmail: 'john.smith@email.com',
      players: 22,
      league: 'Premier League', 
      status: 'Active',
      founded: '2023-01-15',
      wins: 12,
      losses: 3,
      draws: 2,
      points: 39,
      nextMatch: '2025-08-20',
      homeField: 'Main Field'
    },
    { 
      id: 'T002', 
      name: 'Chelsea United', 
      coach: 'Mike Johnson',
      coachEmail: 'mike.johnson@email.com',
      players: 20,
      league: 'Champions League', 
      status: 'Active',
      founded: '2023-03-10',
      wins: 10,
      losses: 4,
      draws: 3,
      points: 33,
      nextMatch: '2025-08-22',
      homeField: 'Training Pitch'
    },
    { 
      id: 'T003', 
      name: 'Liverpool Stars', 
      coach: 'Sarah Wilson',
      coachEmail: 'sarah.wilson@email.com',
      players: 18,
      league: 'Youth League', 
      status: 'Active',
      founded: '2023-06-20',
      wins: 8,
      losses: 2,
      draws: 1,
      points: 25,
      nextMatch: '2025-08-25',
      homeField: 'Indoor Field'
    },
    { 
      id: 'T004', 
      name: 'Manchester Rovers', 
      coach: 'David Brown',
      coachEmail: 'david.brown@email.com',
      players: 19,
      league: 'Premier League', 
      status: 'Inactive',
      founded: '2022-11-05',
      wins: 5,
      losses: 8,
      draws: 4,
      points: 19,
      nextMatch: 'TBD',
      homeField: 'Main Field'
    },
    { 
      id: 'T005', 
      name: 'Barcelona Kilifi', 
      coach: 'James Wilson',
      coachEmail: 'james.wilson@email.com',
      players: 21,
      league: 'Champions League', 
      status: 'Active',
      founded: '2023-08-12',
      wins: 7,
      losses: 3,
      draws: 2,
      points: 23,
      nextMatch: '2025-08-28',
      homeField: 'Training Pitch'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLeagueColor = (league: string) => {
    switch (league) {
      case 'Premier League': return 'bg-blue-100 text-blue-800'
      case 'Champions League': return 'bg-purple-100 text-purple-800'
      case 'Youth League': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.coach.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         team.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || team.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">All Teams</h3>
            <p className="text-gray-600 text-sm mt-1">Manage teams and their information</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams..."
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
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
              <PlusOutlined /> Add Team
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coach</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">League & Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Players</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Match</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTeams.map((team) => (
              <tr key={team.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3A8726FF] text-white rounded-full flex items-center justify-center font-bold">
                      {team.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{team.name}</div>
                      <div className="text-sm text-gray-500 font-mono">{team.id}</div>
                      <div className="text-xs text-gray-400">Founded: {new Date(team.founded).getFullYear()}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{team.coach}</div>
                    <div className="text-sm text-gray-500">{team.coachEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLeagueColor(team.league)}`}>
                      {team.league}
                    </span>
                    <br />
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(team.status)}`}>
                      {team.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{team.points} pts</div>
                    <div className="text-xs text-gray-500">
                      W: {team.wins} | D: {team.draws} | L: {team.losses}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <UserOutlined className="text-gray-400 text-xs" />
                    <span className="text-sm font-medium text-gray-900">{team.players}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{team.nextMatch}</div>
                    <div className="text-xs text-gray-500">{team.homeField}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800" title="View Team">
                      <EyeOutlined />
                    </button>
                    <button className="text-green-600 hover:text-green-800" title="Edit Team">
                      <EditOutlined />
                    </button>
                    <button className="text-purple-600 hover:text-purple-800" title="Schedule Match">
                      <CalendarOutlined />
                    </button>
                    <button className="text-red-600 hover:text-red-800" title="Delete Team">
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTeams.length}</span> of{' '}
          <span className="font-medium">{teams.length}</span> results
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

// Main Teams Page Component
export default function TeamsPage() {
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
          <h1 className="text-xl font-bold text-gray-800">Teams</h1>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
          {/* Page Header */}
          <div className="mb-6">
            <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Teams</span>
            </nav>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <p className="text-gray-600 mt-1">Manage teams and their information</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <DownloadOutlined /> Export
                </button>
                <button className="px-4 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] flex items-center gap-2">
                  <PlusOutlined /> Add Team
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <TeamStats />

          {/* Teams Table */}
          <TeamsTable />
        </div>
      </div>
    </div>
  )
}
