'use client'

import React, { useEffect, useRef, useState } from 'react'
import { 
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  StarOutlined,
  PlusOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { Spin, message } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import { teamsAPI } from '@/utils/api'
import { TeamTypes } from '@/types'
import TeamsTable from '@/components/admin/Tables/TeamsTable'
import TeamModal from '@/components/admin/Modals/TeamModal'
import TeamRequestsTable from '@/components/admin/Tables/TeamRequestsTable'

// Stats Component for Teams
const TeamStats = ({ teams }: { teams: TeamTypes[] }) => {
  const stats = [
    { 
      title: 'Total Teams', 
      value: teams.length.toString(), 
      icon: <TeamOutlined />, 
      color: 'text-blue-600', 
      subtitle: 'Registered teams'
    },
    { 
      title: 'Active Teams', 
      value: teams.filter(team => team.status === 'active').length.toString(), 
      icon: <StarOutlined />, 
      color: 'text-green-600', 
      subtitle: 'Currently playing'
    },
    { 
      title: 'Total Players', 
      value: teams.reduce((acc, team) => acc + (team.members?.length || 0), 0).toString(), 
      icon: <UserOutlined />, 
      color: 'text-purple-600', 
      subtitle: 'Across all teams'
    },
    // { 
    //   title: 'Championships', 
    //   value: '6', 
    //   icon: <TrophyOutlined />, 
    //   color: 'text-orange-600', 
    //   subtitle: 'This season'
    // },
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


// Main Teams Page Component
export default function TeamsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [teams, setTeams] = useState<TeamTypes[]>([])  
  const [loading, setLoading] = useState(true)
  const [componentsReady, setComponentsReady] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // data retrieval
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      try {
        const teamsResponse = await teamsAPI.getAll()
        console.log("teams fetched:", teamsResponse.data)
        setTeams(teamsResponse.data)
      } catch (error) {
        console.error('Error fetching teams:', error)
        message.error('Failed to load teams data')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [refresh])  // Effect to check if components have rendered
  useEffect(() => {
    if (!loading && teams.length >= 0) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        // Additional delay to ensure all child components have rendered
        setTimeout(() => {
          setComponentsReady(true)
        }, 200)
      })
    }
  }, [loading, teams])

  // Reset components ready state when refresh happens
  useEffect(() => {
    if (refresh) {
      setComponentsReady(false)
    }
  }, [refresh])

  // Wrapper function for setRefresh to match expected signature
  const handleRefresh = () => {
    console.log('handleRefresh called - current refresh state:', refresh)
    setRefresh(prev => {
      console.log('Toggling refresh from', prev, 'to', !prev)
      return !prev
    })
  }

  const [modalType, setModalType] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleModalClose = () => {
    setIsModalOpen(false)
    setModalType('')
    setSelectedData(null)
  }

  const handleModalOpen = (type : string, item?: any) => {
    setModalType(type)
    setIsModalOpen(true)
    setSelectedData(item || null)
  }

  if (loading) {
    return (
      <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
        <SideMenu 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className='flex-1 flex items-center justify-center'>
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-600">Loading teams data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <SideMenu 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Enhanced Mobile Header */}
        <div className="md:hidden bg-white shadow-lg border-b border-gray-200 p-4 pl-16 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Teams</h1>
              <p className="text-sm text-gray-500">Manage teams</p>
            </div>
            <button 
              onClick={() => handleModalOpen('Add')}
              className="p-2 bg-[#3A8726FF] text-white rounded-full hover:bg-[#2d6b1f] transition-colors shadow-lg"
              title="Add Team"
            >
              <PlusOutlined />
            </button>
          </div>
        </div>
        
        {/* Enhanced Main Content */}
        <div className='flex-1 p-4 md:p-8 overflow-y-auto'>
          {/* Modern Page Header */}
          <div className="mb-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/admin" className="hover:text-[#3A8726FF] transition-colors font-medium">
                Dashboard
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-semibold">Teams</span>
            </nav>
            
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Management</h1>
                <p className="text-gray-600">Manage teams and their information</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleModalOpen('Add')} 
                  className="px-6 py-3 bg-[#3A8726FF] text-white rounded-xl hover:bg-[#2d6b1f] flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl font-medium"
                >
                  <PlusOutlined /> Add Team
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <TeamStats teams={teams} />

          {/* Teams Table */}
          <TeamsTable teams={teams} setRefresh={handleRefresh} loading={loading} />

          {/* Team Modals */}
         {isModalOpen && (
            <TeamModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                setRefresh={handleRefresh}
                item={selectedData}
                type={modalType}
            />
          )}
        </div>
      </div>
    </div>
  )
}
