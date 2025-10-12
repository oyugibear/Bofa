'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Button, Spin, Empty, message } from 'antd'
import { 
  PlusOutlined,
  CalendarOutlined,
  EditOutlined 
} from '@ant-design/icons'
import { League } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { useLeagues } from '@/hooks/useLeagues'

// Components
import LeagueStats from '@/components/leagues/LeagueStats'
import LeagueFilters from '@/components/leagues/LeagueFilters'
import LeagueCard from '@/components/leagues/LeagueCard'
import TeamRegistrationModal from '@/components/leagues/TeamRegistrationModal'
import LeagueDetailsModal from '@/components/leagues/LeagueDetailsModal'
import AdminQuickActions from '@/components/leagues/AdminQuickActions'

export default function LeaguesPage() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false)
  const { user } = useAuth()
  const { leagues, loading, error, refreshLeagues } = useLeagues()

  // Filter leagues based on search and filters
  const filteredLeagues = useMemo(() => {
    return leagues.filter(league => {
      const matchesSearch = searchTerm === '' || 
        league.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        league.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === 'all' || league.status === filterStatus
      const matchesCategory = filterCategory === 'all' || league.category === filterCategory
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [leagues, searchTerm, filterStatus, filterCategory])

  const openLeagueDetails = (league: League) => {
    setSelectedLeague(league)
    setModalVisible(true)
    setActiveTab('overview')
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterStatus('all')
    setFilterCategory('all')
  }

  const handleRegistrationSuccess = () => {
    refreshLeagues()
  }

  // Admin actions
  const handleCreateLeague = () => {
    message.info('Create League functionality - redirecting to admin panel...')
    // TODO: Implement create league functionality
  }

  const handleManageTeams = () => {
    message.info('Manage Teams functionality - redirecting to admin panel...')
    // TODO: Implement manage teams functionality
  }

  const handleScheduleMatches = () => {
    message.info('Schedule Matches functionality - redirecting to admin panel...')
    // TODO: Implement schedule matches functionality
  }

  const handleUpdateStandings = () => {
    message.info('Update Standings functionality - redirecting to admin panel...')
    // TODO: Implement update standings functionality
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Leagues</h1>
            <p className="text-lg text-gray-600 mb-8">{error}</p>
            <Button 
              type="primary" 
              onClick={refreshLeagues}
              loading={loading}
              size="large"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">Football Leagues</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Join competitive football leagues at Arena 03 Kilifi. From youth development to professional competitions, 
            find your perfect league and showcase your skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              type="primary" 
              size="large" 
              icon={<PlusOutlined />}
              onClick={() => setRegistrationModalVisible(true)}
              className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
            >
              Register Your Team
            </Button>
            <Link href="/booking">
              <Button size="large" icon={<CalendarOutlined />}>
                Book Training Session
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button size="large" icon={<EditOutlined />} type="dashed">
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
          
          {/* Admin Quick Actions */}
          {user?.role === 'admin' && (
            <AdminQuickActions
              onCreateLeague={handleCreateLeague}
              onManageTeams={handleManageTeams}
              onScheduleMatches={handleScheduleMatches}
              onUpdateStandings={handleUpdateStandings}
            />
          )}
        </div>

        {/* League Statistics */}
        <LeagueStats leagues={leagues} loading={loading} />

        {/* Search and Filters */}
        <LeagueFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filteredCount={filteredLeagues.length}
          onClearFilters={handleClearFilters}
        />

        {/* Leagues Grid */}
        <Spin spinning={loading}>
          {filteredLeagues.length === 0 && !loading ? (
            <Empty
              description="No leagues found matching your criteria"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeagues.map((league) => (
                <LeagueCard
                  key={league._id || league.title}
                  league={league}
                  onViewDetails={openLeagueDetails}
                  onRegisterTeam={() => setRegistrationModalVisible(true)}
                />
              ))}
            </div>
          )}
        </Spin>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Competition?</h2>
          <p className="text-xl text-green-100 mb-6 max-w-3xl mx-auto">
            Register your team today and be part of the most exciting football leagues on the Kenyan coast. 
            Professional organization, competitive play, and amazing prizes await!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="large"
              className="bg-white text-[#3A8726FF] border-white hover:bg-gray-100"
              onClick={() => setRegistrationModalVisible(true)}
            >
              Register Your Team
            </Button>
            <Link href="/about">
              <Button 
                size="large"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#3A8726FF]"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Modals */}
        <TeamRegistrationModal
          visible={registrationModalVisible}
          onClose={() => setRegistrationModalVisible(false)}
          leagueId={selectedLeague?._id}
          onSuccess={handleRegistrationSuccess}
        />

        <LeagueDetailsModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          league={selectedLeague}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  )
}
