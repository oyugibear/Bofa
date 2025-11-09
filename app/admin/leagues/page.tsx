'use client'

import React, { useEffect, useState } from 'react'
import { 
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  DollarOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Spin, message } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../components/admin/SideMenu'
import LeaguesTable from '@/components/admin/Tables/LeaguesTable'
import LeagueModal from '@/components/admin/Modals/LeaguesModal'
import { League } from '@/types'
import { leaguesAPI } from '@/utils/api'

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

// Main Leagues Page Component
export default function LeaguesPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [componentsReady, setComponentsReady] = useState(false)
  const [refresh, setRefresh] = useState(false)
  
  // data retrieval
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true)
      try {
        const leaguesResponse = await leaguesAPI.getAll()
        console.log("leagues fetched:", leaguesResponse.data)
        setLeagues(leaguesResponse.data)
      } catch (error) {
        console.error('Error fetching leagues:', error)
        message.error('Failed to load leagues data')
      } finally {
        setLoading(false)
      }
    }

    fetchLeagues()
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
            <p className="mt-4 text-gray-600">Loading leagues data...</p>
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
              <h1 className="text-xl font-bold text-gray-800">Leagues</h1>
              <p className="text-sm text-gray-500">Manage competitions</p>
            </div>
            <button 
              onClick={() => handleModalOpen('Add')}
              className="p-2 bg-[#3A8726FF] text-white rounded-full hover:bg-[#2d6b1f] transition-colors shadow-lg"
              title="Create League"
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
              <span className="text-gray-900 font-semibold">Leagues</span>
            </nav>
            
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">League Management</h1>
                <p className="text-gray-600">Manage tournaments and competitions</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleModalOpen('Add')} 
                  className="px-6 py-3 bg-[#3A8726FF] text-white rounded-xl hover:bg-[#2d6b1f] flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl font-medium"
                >
                  <PlusOutlined /> Create League
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <LeagueStats />

          {/* Leagues Table */}
          <LeaguesTable leagues={leagues} setRefresh={handleRefresh} loading={loading} />
        </div>
      </div>

      {isModalOpen && (
        <LeagueModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            setRefresh={handleRefresh}
            item={selectedData}
            type={modalType}
        />
      )}
    </div>
  )
}
