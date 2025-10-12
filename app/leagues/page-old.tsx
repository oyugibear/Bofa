'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Card, 
  Button, 
  Badge, 
  Input, 
  Select, 
  Modal, 
  Form, 
  Typography, 
  Row, 
  Col, 
  Spin, 
  Empty, 
  message,
  DatePicker,
  InputNumber,
  Statistic,
  Avatar,
  Tag,
  Tabs,
  Table
} from 'antd'
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
  RiseOutlined,
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { League, MatchTypes, TeamTypes, StandingsTeam, FixtureMatch, LeagueStats } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

const { TabPane } = Tabs
const { Search } = Input
const { Option } = Select

// Frontend League interface for display
interface LeagueDisplay {
  _id?: string
  id: string
  title: string
  name: string
  description: string
  season: string
  status: 'active' | 'upcoming' | 'finished'
  numberOfTeams: number
  teams: number // Number of teams for display
  matches: number // Number of matches for display
  startDate: string
  endDate: string
  prizePool: number
  registrationFee: number
  category: string
  level: string
  color: string // Display color
}

export default function LeaguesPage() {
  const [selectedLeague, setSelectedLeague] = useState<LeagueDisplay | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [registrationModalVisible, setRegistrationModalVisible] = useState(false)
  const [form] = Form.useForm()
  const { user } = useAuth()

  // Initialize leagues data
  const [leagues, setLeagues] = useState<LeagueDisplay[]>([
    {
      id: 'arena-premier',
      title: 'Arena Premier League',
      name: 'Arena Premier League',
      description: 'The flagship competition featuring the best teams in the region. High-intensity matches every weekend.',
      season: '2025',
      status: 'active',
      numberOfTeams: 16,
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
      title: 'Youth Championship',
      name: 'Youth Championship',
      description: 'Developing the next generation of football stars. For players under 18 years.',
      season: '2025',
      status: 'active',
      numberOfTeams: 12,
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
      title: 'Women\'s Football League',
      name: 'Women\'s Football League',
      description: 'Empowering women through football. Competitive league for female players of all skill levels.',
      season: '2025',
      status: 'active',
      numberOfTeams: 10,
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
      title: 'Veterans Cup',
      name: 'Veterans Cup',
      description: 'For the experienced players who still have the passion. 35+ years category.',
      season: '2025',
      status: 'upcoming',
      numberOfTeams: 8,
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
      title: 'Corporate League',
      name: 'Corporate League',
      description: 'Inter-company competition. Build team spirit while competing for the corporate trophy.',
      season: '2025',
      status: 'upcoming',
      numberOfTeams: 20,
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
      title: 'Weekend Warriors',
      name: 'Weekend Warriors',
      description: 'Casual league for weekend enthusiasts. Fun, competitive matches every Saturday.',
      season: '2025',
      status: 'active',
      numberOfTeams: 14,
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
  ])

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

  const openLeagueDetails = (league: LeagueDisplay) => {
    setSelectedLeague(league)
    setModalVisible(true)
    setActiveTab('overview')
  }

  // Add API functions
  const fetchLeagues = async () => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/leagues')
      // const data = await response.json()
      // setLeagues(data)
      
      // For now, use the mock data
      message.success('Leagues loaded successfully')
    } catch (error) {
      message.error('Failed to load leagues')
      console.error('Error fetching leagues:', error)
    } finally {
      setLoading(false)
    }
  }

  // Team registration function
  const handleTeamRegistration = async (values: any) => {
    setLoading(true)
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/leagues/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // })
      
      console.log('Registration data:', values)
      message.success('Team registration submitted successfully!')
      setRegistrationModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('Failed to register team')
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter leagues based on search and filters
  const filteredLeagues = leagues.filter(league => {
    const matchesSearch = league.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          league.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || league.status === filterStatus
    const matchesCategory = filterCategory === 'all' || league.category === filterCategory
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Load leagues on component mount
  useEffect(() => {
    fetchLeagues()
  }, [])

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
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Admin Quick Actions</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button size="small" icon={<PlusOutlined />} type="primary">
                  Create League
                </Button>
                <Button size="small" icon={<EditOutlined />}>
                  Manage Teams
                </Button>
                <Button size="small" icon={<CalendarOutlined />}>
                  Schedule Matches
                </Button>
                <Button size="small" icon={<TrophyOutlined />}>
                  Update Standings
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* League Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <Statistic
              title="Total Leagues"
              value={leagues.length}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
          <Card className="text-center">
            <Statistic
              title="Active Leagues"
              value={leagues.filter(l => l.status === 'active').length}
              prefix={<PlayCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
          <Card className="text-center">
            <Statistic
              title="Registered Teams"
              value={leagues.reduce((acc, league) => acc + league.teams, 0)}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
          <Card className="text-center">
            <Statistic
              title="Total Prize Pool"
              value={leagues.reduce((acc, league) => acc + (league.prizePool || 0), 0)}
              prefix="KSh "
              formatter={(value) => `${Number(value).toLocaleString()}`}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Search
                placeholder="Search leagues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:w-64"
                size="large"
              />
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                className="w-full sm:w-32"
                size="large"
              >
                <Option value="all">All Status</Option>
                <Option value="active">Active</Option>
                <Option value="upcoming">Upcoming</Option>
                <Option value="finished">Finished</Option>
              </Select>
              <Select
                value={filterCategory}
                onChange={setFilterCategory}
                className="w-full sm:w-32"
                size="large"
              >
                <Option value="all">All Categories</Option>
                <Option value="adult">Adult</Option>
                <Option value="youth">Youth</Option>
                <Option value="women">Women</Option>
                <Option value="veterans">Veterans</Option>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                icon={<FilterOutlined />}
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('all')
                  setFilterCategory('all')
                }}
              >
                Clear Filters
              </Button>
              <Button 
                icon={<PlusOutlined />} 
                type="dashed"
                onClick={() => fetchLeagues()}
                loading={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
          {filteredLeagues.length !== leagues.length && (
            <div className="mt-4 text-center">
              <Tag color="blue">
                Showing {filteredLeagues.length} of {leagues.length} leagues
              </Tag>
            </div>
          )}
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
        <Spin spinning={loading} tip="Loading leagues...">
          {filteredLeagues.length === 0 ? (
            <div className="text-center py-16">
              <TrophyOutlined className="text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2">No leagues found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeagues.map((league) => (
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
                  
                  <div className="flex gap-2">
                    <Button 
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => openLeagueDetails(league)}
                      style={{ backgroundColor: league.color, borderColor: league.color }}
                      className="flex-1"
                    >
                      Details
                    </Button>
                    <Button 
                      icon={<PlusOutlined />}
                      onClick={() => setRegistrationModalVisible(true)}
                      className="px-3"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
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
        title={selectedLeague?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          // <Button key="register" type="primary" style={{ backgroundColor: selectedLeague?.color }}>
          //   Register TeamTypes
          // </Button>,
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

      {/* Team Registration Modal */}
      <Modal
        title="Register Your Team"
        open={registrationModalVisible}
        onCancel={() => setRegistrationModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleTeamRegistration}
        >
          <Form.Item
            label="Team Name"
            name="teamName"
            rules={[{ required: true, message: 'Please input team name!' }]}
          >
            <Input placeholder="Enter your team name" />
          </Form.Item>

          <Form.Item
            label="Select League"
            name="leagueId"
            rules={[{ required: true, message: 'Please select a league!' }]}
          >
            <Select placeholder="Choose a league to join">
              {leagues.filter(l => l.status !== 'finished').map(league => (
                <Option key={league.id} value={league.id}>
                  {league.name} ({league.category} - {league.level})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Captain Name"
            name="captainName"
            rules={[{ required: true, message: 'Please input captain name!' }]}
          >
            <Input placeholder="Team captain's full name" />
          </Form.Item>

          <Form.Item
            label="Captain Phone"
            name="captainPhone"
            rules={[{ required: true, message: 'Please input captain phone!' }]}
          >
            <Input placeholder="+254 700 000 000" />
          </Form.Item>

          <Form.Item
            label="Captain Email"
            name="captainEmail"
            rules={[
              { required: true, message: 'Please input captain email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="captain@example.com" />
          </Form.Item>

          <Form.Item
            label="Number of Players"
            name="numberOfPlayers"
            rules={[{ required: true, message: 'Please input number of players!' }]}
          >
            <InputNumber 
              min={11} 
              max={30} 
              placeholder="Minimum 11 players"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Team Description"
            name="description"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Brief description about your team (optional)"
            />
          </Form.Item>

          <Form.Item
            label="Previous Experience"
            name="experience"
            rules={[{ required: true, message: 'Please select experience level!' }]}
          >
            <Select placeholder="Select your team's experience level">
              <Option value="beginner">Beginner (New team)</Option>
              <Option value="intermediate">Intermediate (1-3 years)</Option>
              <Option value="advanced">Advanced (3+ years)</Option>
              <Option value="professional">Professional/Semi-Pro</Option>
            </Select>
          </Form.Item>

          <div className="flex justify-end gap-4 mt-6">
            <Button onClick={() => setRegistrationModalVisible(false)}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
            >
              Register Team
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
