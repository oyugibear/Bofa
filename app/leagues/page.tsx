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
import CTALeague from '@/components/constants/Sections/CTALeague'

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
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <header className="mb-20 text-center space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Football Leagues
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join competitive football leagues at Arena 03 Kilifi — from youth
            development to professional competitions. Find your perfect league
            and showcase your skills.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setRegistrationModalVisible(true)}
              className="bg-[#3A8726] hover:bg-[#2d6b1f] border-none px-8 py-2.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              Register Your Team
            </Button>
            <Link href="/booking">
              <Button
                icon={<CalendarOutlined />}
                className="border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 px-8 py-2.5 rounded-xl font-medium transition-all"
              >
                Book Training Session
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button
                  size="large"
                  icon={<EditOutlined />}
                  type="dashed"
                  className="border-[#3A8726] text-[#3A8726] hover:bg-[#e8f5e9] rounded-xl px-8 py-2.5 font-medium"
                >
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>

          {/* Admin Quick Actions */}
          {user?.role === 'admin' && (
            <div className="mt-6">
              <AdminQuickActions
                onCreateLeague={handleCreateLeague}
                onManageTeams={handleManageTeams}
                onScheduleMatches={handleScheduleMatches}
                onUpdateStandings={handleUpdateStandings}
              />
            </div>
          )}
        </header>

        {/* League Statistics */}
        <section className="mb-12">
          <LeagueStats leagues={leagues} loading={loading} />
        </section>

        {/* Filters */}
        <section className="mb-12">
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
        </section>

        {/* Leagues Grid */}
        <section>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
        </section>

        {/* Call to Action */}
        <div className="mt-16">
          <CTALeague setRegistrationModalVisible={setRegistrationModalVisible} />
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
