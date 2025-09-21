
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  TeamOutlined,
  UserOutlined,
  TrophyOutlined,
  CalendarOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  CrownOutlined,
  StarOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { Card, Button, Avatar, Table, Tag, Tabs, Statistic, Row, Col, Typography, Space, Divider, Skeleton } from 'antd'
import Link from 'next/link'
import SideMenu from '../../../../components/admin/SideMenu'
import { LoadingScreen } from '@/components/common'
import { matchesAPI, teamsAPI, userAPI } from '@/utils/api'
import { TeamTypes, MatchTypes, UserType } from '@/types'
import { useToast } from '@/components/Providers/ToastProvider'
import TeamModal from '@/components/admin/Modals/TeamModal'
import MatchModal from '@/components/admin/Modals/MatchModal'
import { useUser } from '@/hooks/useUser'

const { Title, Text } = Typography
const { TabPane } = Tabs

const PaymentStats = ({ data, loading }: { data: TeamTypes, loading: boolean }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    )
  }

  const stats = [
    { 
      title: 'Members', 
      value: data.members?.length || 0,
    },
    { 
      title: 'Matches', 
      value: data.matches?.length || 0,
    },
    { 
      title: 'Points', 
      value: data.points || 0,
    },
    { 
      title: 'Achievements', 
      value: data.achievements?.length || 0,
    },
    
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>

            </div>

          </div>
        </div>
      ))}
    </div>
  )
}

export default function TeamDetailPage() {
    const params = useParams()
    const router = useRouter()
    const toast = useToast()
    const teamId = params.id as string

    const { user } = useUser();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [team, setTeam] = useState<TeamTypes | null>(null)
    const [teams, setTeams] = useState<TeamTypes[] | null>(null)
    const [users, setUsers] = useState<UserType[] | null>(null)
    const [matches, setMatches] = useState<MatchTypes[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchTeam = async () => {
        if (!teamId) return
        
        setLoading(true)
        try {
            const response = await teamsAPI.getById(teamId)
            const usersResponse = await userAPI.getAll()
            const matchesResponse = await matchesAPI.getMatchesByTeamId(teamId)
            const teamsResponse = await teamsAPI.getAll()
            console.log("Team fetched:", response)
            console.log("Users fetched:", usersResponse)
            console.log("Matches fetched:", matchesResponse)
            console.log("Teams fetched:", teamsResponse)
            setTeam(response.data || response)
            setUsers(usersResponse.data || usersResponse)
            setTeams(teamsResponse.data || teamsResponse)
            setMatches(matchesResponse.data || matchesResponse)
        } catch (error) {
            console.error('Error fetching team:', error)
            toast.error('Failed to load team details')
        } finally {
            setLoading(false)
        }
        }

        fetchTeam()
    }, [teamId, refresh])

    const handleDeleteTeam = async () => {
        if (!team?._id) return
        
        try {
        // Check if delete method exists, otherwise use a workaround
        if ('delete' in teamsAPI) {
            await teamsAPI.delete(team._id)
        } else {
            // Fallback - you can implement this later
            console.log('Delete method not available yet')
            toast.error('Delete functionality is not yet implemented')
            return
        }
        toast.success('Team deleted successfully')
        router.push('/admin/teams')
        } catch (error) {
        console.error('Error deleting team:', error)
        toast.error('Failed to delete team')
        }
    }

    const handleRefresh = () => {
    console.log('handleRefresh called - current refresh state:', refresh)
    setRefresh(prev => {
      console.log('Toggling refresh from', prev, 'to', !prev)
      return !prev
    })
  }

    // Mock data for demonstration - replace with actual data from API
    const mockMatches: MatchTypes[] = [
        {
        _id: '1',
        homeTeam: team?.name || 'Team A',
        awayTeam: 'Team B',
        date: '2024-03-15',
        time: '15:00',
        venue: 'Stadium A',
        status: 'upcoming',
        score: {
            home: 0,
            away: 0
        },
        postedBy: 'admin123', // You can update this with actual user ID
        },
        {
        _id: '2',
        homeTeam: 'Team C',
        awayTeam: team?.name || 'Team A',
        date: '2024-03-10',
        time: '18:00',
        venue: 'Stadium B',
        status: 'finished',
        score: {
            home: 2,
            away: 1
        },
        postedBy: 'admin123', // You can update this with actual user ID
        }
    ]

    const memberColumns = [
        {
        title: 'Name',
        key: 'name',
        render: (member: UserType) => (
            <Space>
            <Avatar icon={<UserOutlined />} />
                <span>{`${member.first_name} ${member.second_name}`}</span>
            </Space>
        ),
        },
        {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        },
        {
        title: 'Phone',
        dataIndex: 'phone_number',
        key: 'phone_number',
        },
        {
        title: 'Role',
        key: 'role',
        render: (member: UserType) => (
            <Tag color={member._id === team?.captain?._id ? 'gold' : 'blue'}>
            {member._id === team?.captain?._id ? 'Captain' : 'Player'}
            </Tag>
        ),
        },
    ]

    const matchColumns = [
        {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        },
        {
        title: 'Home Team',
        dataIndex: 'homeTeam',
        key: 'homeTeam',
        render: (homeTeam: TeamTypes) => homeTeam.name,
        },
        {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'awayTeam',
        render: (awayTeam: TeamTypes) => awayTeam.name,
        },
        {
        title: 'Venue',
        dataIndex: 'venue',
        key: 'venue',
        },
        {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={
            status === 'upcoming' ? 'blue' :
            status === 'live' ? 'green' :
            status === 'finished' ? 'default' : 'default'
            }>
            {status?.toUpperCase()}
            </Tag>
        ),
        },
        {
        title: 'Score',
        key: 'score',
        render: (match: MatchTypes) => (
            match.status === 'finished' && match.score
            ? `${match.score.home} - ${match.score.away}`
            : 'N/A'
        ),
        },
    ]

    // Modal Functions
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
        item.users = users
        setSelectedData(item || null)
    }  

    const [matchModalType, setMatchModalType] = useState<string>('')
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)

    const handleMatchModalOpen = (type: string, item?: any) => {
        setMatchModalType(type)
        setIsMatchModalOpen(true)
        item.users = users
        item.teams = teams
        item.currentTeam = team
        item.currentUser = user
        setSelectedData(item || null)
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
        <SideMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <LoadingScreen 
            isLoading={loading}
            title="Loading Team Details"
            description="Please wait while we fetch the team information..."
        />
        
        <div className='flex-1 flex flex-col'>
            {/* Top Header for Mobile */}
            <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
            <h1 className="text-xl font-bold text-gray-800">Team Details</h1>
            </div>
            
            {/* Main Content */}
            <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
            {!loading && !team && (
                <div className="flex flex-col items-center justify-center h-96">
                <TeamOutlined className="text-6xl text-gray-300 mb-4" />
                <Title level={3} type="secondary">Team Not Found</Title>
                <Text type="secondary" className="mb-4">
                    The team you're looking for doesn't exist or has been removed.
                </Text>
                <Button 
                    type="primary" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/admin/teams')}
                    className="bg-[#3A8726FF]"
                >
                    Back to Teams
                </Button>
                </div>
            )}
            
            {!loading && team && (
                <>
                {/* Breadcrumb and Header */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
                    <span>/</span>
                    <Link href="/admin/teams" className="hover:text-[#3A8726FF]">Teams</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{team.name}</span>
                    </nav>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex items-start gap-4">
                        <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => router.push('/admin/teams')}
                        className="hidden sm:flex"
                        >
                        Back to Teams
                        </Button>
                        
                    </div>
                    <div className="flex gap-3">
                        <Button 
                        icon={<EditOutlined />} 
                        type="primary"
                        className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
                        onClick={() => handleModalOpen('Edit', team)}
                        >
                        Edit Team
                        </Button>
                        
                    </div>
                    </div>
                </div>
                <div className='mb-6 px-2'>
                    <Title level={2} className="!mb-1">{team.name}</Title>
                    <Text type="secondary">
                        Created {team.createdAt ? new Date(team.createdAt).toLocaleDateString() : 'Unknown'}
                    </Text>
                </div>

                {/* Team Stats */}
                <PaymentStats data={team} loading={loading} />

                {/* Main Content Tabs */}
                <Card>
                    <Tabs defaultActiveKey="overview" size="large">
                        {/* Overview */}
                        <TabPane tab="Overview" key="overview">
                            <Row gutter={24}>
                            <Col xs={24} lg={12}>
                                <Card title="Team Information" className="mb-4">
                                <Space direction="vertical" className="w-full">
                                    <div>
                                    <Text strong>Team Name:</Text>
                                    <div>{team.name}</div>
                                    </div>
                                    {team.coach && (
                                    <div>
                                        <Text strong>Coach:</Text>
                                        <div>{`${team.coach.first_name} ${team.coach.second_name}`}</div>
                                    </div>
                                    )}
                                    {team.captain && (
                                    <div>
                                        <Text strong>Captain:</Text>
                                        <div className="flex items-center gap-2">
                                        {`${team.captain.first_name} ${team.captain.second_name}`}
                                        <CrownOutlined style={{ color: '#faad14' }} />
                                        </div>
                                    </div>
                                    )}
                                    <div>
                                    <Text strong>Status:</Text>
                                    <div>
                                        <Tag color={team.status === 'active' ? 'green' : 'default'}>
                                        {(team.status || 'Active').toUpperCase()}
                                        </Tag>
                                    </div>
                                    </div>
                                    <div>
                                    <Text strong>Total Points:</Text>
                                    <div>{team.points || 0}</div>
                                    </div>
                                </Space>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="Recent Achievements" className="mb-4">
                                {team.achievements && team.achievements.length > 0 ? (
                                    <Space direction="vertical" className="w-full">
                                    {team.achievements.slice(0, 3).map((achievement, index) => (
                                        <div key={index} className="border-l-4 border-[#3A8726FF] pl-4">
                                        <div className="font-semibold">{achievement.title}</div>
                                        <div className="text-gray-600 text-sm">{achievement.description}</div>
                                        <div className="text-gray-400 text-xs">
                                            {new Date(achievement.date).toLocaleDateString()}
                                        </div>
                                        </div>
                                    ))}
                                    </Space>
                                ) : (
                                    <Text type="secondary">No achievements recorded yet</Text>
                                )}
                                </Card>
                            </Col>
                            </Row>
                            
                        </TabPane>

                        {/* Members */}
                        <TabPane tab={`Members (${team.members?.length || 0})`} key="members">
                            <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>Team Members</Title>
                            <Button type="primary" onClick={() => handleModalOpen('Edit Members', team)} icon={<PlusOutlined />} className="bg-[#3A8726FF]">
                                Add Member
                            </Button>
                            </div>
                            <Table 
                                columns={memberColumns}
                                dataSource={team.members || []}
                                rowKey="_id"
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 800 }}
                            />
                        </TabPane>

                        <TabPane tab={`Matches (${matches?.length || 0})`} key="matches">
                            <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>Match History</Title>
                            <Button onClick={() => handleMatchModalOpen('Add', matches)} type="primary" icon={<PlusOutlined />} className="bg-[#3A8726FF]">
                                Schedule Match
                            </Button>
                            </div>
                            <Table 
                            columns={matchColumns}
                            dataSource={team.matches || []}
                            rowKey={(record, index) => record._id || `match-${index}`}
                            pagination={{ pageSize: 10 }}
                            scroll={{ x: 1000 }}
                            />
                        </TabPane>
                    </Tabs>
                </Card>
                </>
            )}
            </div>
        </div>

            {isModalOpen && (
                <TeamModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    setRefresh={handleRefresh}
                    item={selectedData}
                    type={modalType}
                />
            )}

            {isMatchModalOpen && (
                <MatchModal
                    isOpen={isMatchModalOpen}
                    onClose={() => setIsMatchModalOpen(false)}
                    setRefresh={handleRefresh}
                    item={selectedData}
                    type={matchModalType}
                />
            )}
        </div>
    )
}
