'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, Badge, Button, Table, Tabs, Modal, Tag, Avatar } from 'antd'
import { 
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  StarOutlined,
  PlayCircleOutlined,
  EyeOutlined,
  UserOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  RiseOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { League, MatchTypes, TeamTypes, StandingsTeam, FixtureMatch, LeagueStats } from '@/types'

const { TabPane } = Tabs

export default function LeaguesPage() {
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const leagues: League[] = [
    {
      id: 'arena-premier',
      name: 'Arena Premier League',
      description: 'The flagship competition featuring the best teams in the region. High-intensity matches every weekend.',
      season: '2025',
      status: 'active',
      teams: 16,
      matches: 240,
      startDate: '2025-03-01',
      endDate: '2025-11-30',
      prizePool: 500000,
      registrationFee: 25000,
      category: 'adult',
      level: 'semi-pro',
      color: '#FFD700'
    },
    {
      id: 'youth-championship',
      name: 'Youth Championship',
      description: 'Developing the next generation of football stars. For players under 18 years.',
      season: '2025',
      status: 'active',
      teams: 12,
      matches: 132,
      startDate: '2025-02-15',
      endDate: '2025-10-15',
      prizePool: 200000,
      registrationFee: 15000,
      category: 'youth',
      level: 'amateur',
      color: '#4ECDC4'
    },
    {
      id: 'womens-league',
      name: 'Women\'s Football League',
      description: 'Empowering women through football. Competitive league for female players of all skill levels.',
      season: '2025',
      status: 'active',
      teams: 10,
      matches: 90,
      startDate: '2025-04-01',
      endDate: '2025-12-01',
      prizePool: 300000,
      registrationFee: 20000,
      category: 'women',
      level: 'semi-pro',
      color: '#E74C3C'
    },
    {
      id: 'veterans-cup',
      name: 'Veterans Cup',
      description: 'For the experienced players who still have the passion. 35+ years category.',
      season: '2025',
      status: 'upcoming',
      teams: 8,
      matches: 56,
      startDate: '2025-09-01',
      endDate: '2025-12-15',
      prizePool: 150000,
      registrationFee: 12000,
      category: 'veterans',
      level: 'amateur',
      color: '#9B59B6'
    },
    {
      id: 'corporate-league',
      name: 'Corporate League',
      description: 'Inter-company competition. Build team spirit while competing for the corporate trophy.',
      season: '2025',
      status: 'upcoming',
      teams: 20,
      matches: 190,
      startDate: '2025-08-01',
      endDate: '2025-11-30',
      prizePool: 250000,
      registrationFee: 18000,
      category: 'adult',
      level: 'amateur',
      color: '#3498DB'
    },
    {
      id: 'weekend-warriors',
      name: 'Weekend Warriors',
      description: 'Casual league for weekend enthusiasts. Fun, competitive matches every Saturday.',
      season: '2025',
      status: 'active',
      teams: 14,
      matches: 182,
      startDate: '2025-01-15',
      endDate: '2025-12-31',
      prizePool: 100000,
      registrationFee: 8000,
      category: 'adult',
      level: 'amateur',
      color: '#F39C12'
    }
  ]

  // Mock standings data for active leagues
  const mockStandings: { [key: string]: StandingsTeam[] } = {
    'arena-premier': [
      { id: '1', name: 'Kilifi Warriors', played: 15, wins: 12, draws: 2, losses: 1, goalsFor: 35, goalsAgainst: 8, points: 38, form: ['W', 'W', 'D', 'W', 'W'] },
      { id: '2', name: 'Coastal United', played: 15, wins: 11, draws: 3, losses: 1, goalsFor: 32, goalsAgainst: 12, points: 36, form: ['W', 'D', 'W', 'W', 'L'] },
      { id: '3', name: 'Malindi FC', played: 15, wins: 9, draws: 4, losses: 2, goalsFor: 28, goalsAgainst: 15, points: 31, form: ['D', 'W', 'W', 'D', 'W'] },
      { id: '4', name: 'Ocean Breeze', played: 15, wins: 8, draws: 3, losses: 4, goalsFor: 24, goalsAgainst: 18, points: 27, form: ['L', 'W', 'D', 'W', 'W'] },
      { id: '5', name: 'Watamu Rangers', played: 15, wins: 6, draws: 5, losses: 4, goalsFor: 22, goalsAgainst: 20, points: 23, form: ['D', 'L', 'W', 'D', 'W'] }
    ],
    'youth-championship': [
      { id: '1', name: 'Young Guns', played: 12, wins: 10, draws: 1, losses: 1, goalsFor: 28, goalsAgainst: 8, points: 31, form: ['W', 'W', 'W', 'D', 'W'] },
      { id: '2', name: 'Future Stars', played: 12, wins: 8, draws: 2, losses: 2, goalsFor: 24, goalsAgainst: 12, points: 26, form: ['W', 'L', 'W', 'W', 'D'] },
      { id: '3', name: 'Rising Eagles', played: 12, wins: 7, draws: 3, losses: 2, goalsFor: 21, goalsAgainst: 14, points: 24, form: ['D', 'W', 'W', 'L', 'W'] },
      { id: '4', name: 'Academy Lions', played: 12, wins: 6, draws: 2, losses: 4, goalsFor: 18, goalsAgainst: 16, points: 20, form: ['W', 'D', 'L', 'W', 'W'] }
    ],
    'womens-league': [
      { id: '1', name: 'Coastal Queens', played: 10, wins: 8, draws: 1, losses: 1, goalsFor: 22, goalsAgainst: 6, points: 25, form: ['W', 'W', 'D', 'W', 'W'] },
      { id: '2', name: 'Kilifi Ladies', played: 10, wins: 7, draws: 2, losses: 1, goalsFor: 19, goalsAgainst: 8, points: 23, form: ['W', 'D', 'W', 'W', 'L'] },
      { id: '3', name: 'Ocean Pearls', played: 10, wins: 5, draws: 2, losses: 3, goalsFor: 15, goalsAgainst: 12, points: 17, form: ['L', 'W', 'D', 'W', 'W'] },
      { id: '4', name: 'Malindi Roses', played: 10, wins: 4, draws: 1, losses: 5, goalsFor: 12, goalsAgainst: 15, points: 13, form: ['L', 'L', 'W', 'D', 'W'] }
    ]
  }

  // Mock upcoming matches
  const upcomingMatches: { [key: string]: FixtureMatch[] } = {
    'arena-premier': [
      { id: '1', homeTeam: 'Kilifi Warriors', awayTeam: 'Coastal United', date: '2025-08-15', time: '16:00', venue: 'Arena 03 Main Field', status: 'upcoming' },
      { id: '2', homeTeam: 'Malindi FC', awayTeam: 'Ocean Breeze', date: '2025-08-15', time: '18:30', venue: 'Arena 03 Main Field', status: 'upcoming' },
      { id: '3', homeTeam: 'Watamu Rangers', awayTeam: 'Kilifi Warriors', date: '2025-08-17', time: '15:00', venue: 'Training Pitch', status: 'upcoming' }
    ],
    'youth-championship': [
      { id: '1', homeTeam: 'Young Guns', awayTeam: 'Future Stars', date: '2025-08-14', time: '14:00', venue: 'Training Pitch', status: 'upcoming' },
      { id: '2', homeTeam: 'Rising Eagles', awayTeam: 'Academy Lions', date: '2025-08-16', time: '16:00', venue: 'Arena 03 Main Field', status: 'upcoming' }
    ],
    'womens-league': [
      { id: '1', homeTeam: 'Coastal Queens', awayTeam: 'Kilifi Ladies', date: '2025-08-16', time: '10:00', venue: 'Arena 03 Main Field', status: 'upcoming' },
      { id: '2', homeTeam: 'Ocean Pearls', awayTeam: 'Malindi Roses', date: '2025-08-18', time: '15:30', venue: 'Training Pitch', status: 'upcoming' }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'upcoming': return 'blue'
      case 'finished': return 'gray'
      default: return 'default'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'youth': return <RiseOutlined />
      case 'adult': return <UserOutlined />
      case 'women': return <StarOutlined />
      case 'veterans': return <CrownOutlined />
      default: return <TeamOutlined />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'professional': return <Badge count="PRO" style={{ backgroundColor: '#FFD700' }} />
      case 'semi-pro': return <Badge count="SEMI-PRO" style={{ backgroundColor: '#FF6B6B' }} />
      case 'amateur': return <Badge count="AMATEUR" style={{ backgroundColor: '#4ECDC4' }} />
      default: return null
    }
  }

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W': return 'green'
      case 'D': return 'orange'
      case 'L': return 'red'
      default: return 'default'
    }
  }

  const standingsColumns: ColumnsType<StandingsTeam> = [
    {
      title: 'Pos',
      key: 'position',
      width: 60,
      render: (_, __, index) => (
        <span className={`font-bold ${
          index === 0 ? 'text-yellow-600' : 
          index < 3 ? 'text-green-600' : 
          'text-gray-600'
        }`}>
          {index + 1}
        </span>
      )
    },
    {
      title: 'TeamTypes',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div className="flex items-center gap-2">
          <Avatar size="small" icon={<TeamOutlined />} />
          <span className="font-medium">{name}</span>
        </div>
      )
    },
    {
      title: 'P',
      dataIndex: 'played',
      key: 'played',
      width: 50
    },
    {
      title: 'W',
      dataIndex: 'wins',
      key: 'wins',
      width: 50
    },
    {
      title: 'D',
      dataIndex: 'draws',
      key: 'draws',
      width: 50
    },
    {
      title: 'L',
      dataIndex: 'losses',
      key: 'losses',
      width: 50
    },
    {
      title: 'GF',
      dataIndex: 'goalsFor',
      key: 'goalsFor',
      width: 60
    },
    {
      title: 'GA',
      dataIndex: 'goalsAgainst',
      key: 'goalsAgainst',
      width: 60
    },
    {
      title: 'GD',
      key: 'goalDifference',
      width: 60,
      render: (_, record) => {
        const gd = record.goalsFor - record.goalsAgainst
        return (
          <span className={gd > 0 ? 'text-green-600' : gd < 0 ? 'text-red-600' : 'text-gray-600'}>
            {gd > 0 ? '+' : ''}{gd}
          </span>
        )
      }
    },
    {
      title: 'Pts',
      dataIndex: 'points',
      key: 'points',
      width: 60,
      render: (points) => <span className="font-bold">{points}</span>
    },
    {
      title: 'Form',
      dataIndex: 'form',
      key: 'form',
      width: 120,
      render: (form) => (
        <div className="flex gap-1">
          {form.slice(-5).map((result: string, index: number) => (
            <Tag key={index} color={getFormColor(result)} className="min-w-[20px] text-center text-xs">
              {result}
            </Tag>
          ))}
        </div>
      )
    }
  ]

  const openLeagueDetails = (league: League) => {
    setSelectedLeague(league)
    setModalVisible(true)
    setActiveTab('overview')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">Football Leagues</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Join competitive football leagues at Arena 03 Kilifi. From youth development to professional competitions, 
            find your perfect league and showcase your skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-[#3A8726FF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2d6b1f] transition-colors">
              Register Your TeamTypes
            </Link>
            <Link href="/booking" className="border-2 border-[#3A8726FF] text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-[#3A8726FF] hover:text-white transition-colors">
              Book Training Session
            </Link>
          </div>
        </div>

        {/* League Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <TrophyOutlined className="text-4xl text-[#3A8726FF] mb-2" />
            <div className="text-2xl font-bold text-gray-800">6</div>
            <div className="text-gray-600">Active Leagues</div>
          </Card>
          <Card className="text-center">
            <TeamOutlined className="text-4xl text-[#3A8726FF] mb-2" />
            <div className="text-2xl font-bold text-gray-800">80+</div>
            <div className="text-gray-600">Registered Teams</div>
          </Card>
          <Card className="text-center">
            <PlayCircleOutlined className="text-4xl text-[#3A8726FF] mb-2" />
            <div className="text-2xl font-bold text-gray-800">500+</div>
            <div className="text-gray-600">Matches Played</div>
          </Card>
          <Card className="text-center">
            <StarOutlined className="text-4xl text-[#3A8726FF] mb-2" />
            <div className="text-2xl font-bold text-gray-800">KSh 1.5M</div>
            <div className="text-gray-600">Total Prize Pool</div>
          </Card>
        </div>

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leagues.map((league) => (
            <Card 
              key={league.id}
              className="hover:shadow-xl transition-shadow border-0 overflow-hidden"
              cover={
                <div 
                  className="h-32 flex items-center justify-center text-white relative"
                  style={{ backgroundColor: league.color }}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative text-center">
                    <TrophyOutlined className="text-4xl mb-2" />
                    <div className="font-bold text-lg">{league.season} Season</div>
                  </div>
                </div>
              }
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{league.name}</h3>
                    <Tag color={getStatusColor(league.status)} className="mb-2">
                      {league.status.toUpperCase()}
                    </Tag>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getLevelBadge(league.level)}
                    <div className="text-2xl" style={{ color: league.color }}>
                      {getCategoryIcon(league.category)}
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 text-sm">{league.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Teams:</span>
                    <span className="font-semibold">{league.teams}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Matches:</span>
                    <span className="font-semibold">{league.matches}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prize Pool:</span>
                    <span className="font-semibold text-[#3A8726FF]">KSh {league.prizePool.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Registration:</span>
                    <span className="font-semibold">KSh {league.registrationFee.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                    <span>{new Date(league.startDate).toLocaleDateString()}</span>
                    <span>to</span>
                    <span>{new Date(league.endDate).toLocaleDateString()}</span>
                  </div>
                  
                  <Button 
                    type="primary"
                    block
                    icon={<EyeOutlined />}
                    onClick={() => openLeagueDetails(league)}
                    style={{ backgroundColor: league.color, borderColor: league.color }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Competition?</h2>
          <p className="text-xl text-green-100 mb-6 max-w-3xl mx-auto">
            Register your team today and be part of the most exciting football leagues on the Kenyan coast. 
            Professional organization, competitive play, and amazing prizes await!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Register Your TeamTypes
            </Link>
            <Link href="/about" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3A8726FF] transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* League Details Modal */}
      <Modal
        title={selectedLeague?.name}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="register" type="primary" style={{ backgroundColor: selectedLeague?.color }}>
            Register TeamTypes
          </Button>,
          <Button key="contact" type="default">
            Contact Organizer
          </Button>
        ]}
        width={900}
      >
        {selectedLeague && (
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Overview" key="overview">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="League Information" size="small">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Season:</span>
                        <span className="font-semibold">{selectedLeague.season}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-semibold capitalize">{selectedLeague.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="font-semibold capitalize">{selectedLeague.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Teams:</span>
                        <span className="font-semibold">{selectedLeague.teams}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Matches:</span>
                        <span className="font-semibold">{selectedLeague.matches}</span>
                      </div>
                    </div>
                  </Card>

                  <Card title="Financial Details" size="small">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <span className="font-semibold">KSh {selectedLeague.registrationFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prize Pool:</span>
                        <span className="font-semibold text-[#3A8726FF]">KSh {selectedLeague.prizePool.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-semibold">{new Date(selectedLeague.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-semibold">{new Date(selectedLeague.endDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h4 className="font-bold mb-2">League Description</h4>
                  <p className="text-gray-600">{selectedLeague.description}</p>
                </div>
              </div>
            </TabPane>

            {selectedLeague.status === 'active' && mockStandings[selectedLeague.id] && (
              <TabPane tab="Standings" key="standings">
                <Table
                  columns={standingsColumns}
                  dataSource={mockStandings[selectedLeague.id]}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              </TabPane>
            )}

            {selectedLeague.status === 'active' && upcomingMatches[selectedLeague.id] && (
              <TabPane tab="Fixtures" key="fixtures">
                <div className="space-y-4">
                  {upcomingMatches[selectedLeague.id].map((match) => (
                    <Card key={match.id} size="small">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="font-semibold">{match.homeTeam}</div>
                            <div className="text-xs text-gray-500">vs</div>
                            <div className="font-semibold">{match.awayTeam}</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <CalendarOutlined />
                            {new Date(match.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <ClockCircleOutlined />
                            {match.time}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <EnvironmentOutlined />
                            {match.venue}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabPane>
            )}
          </Tabs>
        )}
      </Modal>
    </div>
  )
}
