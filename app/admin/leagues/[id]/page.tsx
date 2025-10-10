
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  TrophyOutlined,
  UserOutlined,
  TeamOutlined,
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
import { matchesAPI, teamsAPI, userAPI, leaguesAPI } from '@/utils/api'
import { TeamTypes, MatchTypes, UserType, League } from '@/types'
import { useToast } from '@/components/Providers/ToastProvider'
import LeaguesModal from '@/components/admin/Modals/LeaguesModal'
import MatchModal from '@/components/admin/Modals/MatchModal'
import { useUser } from '@/hooks/useUser'
import LeagueTeamModal from '@/components/admin/Modals/LeagueTeamModal'
import CreateMatchesModal from '@/components/admin/Modals/CreateMatchesModal'
import { BsEye } from 'react-icons/bs'

const { Title, Text } = Typography
const { TabPane } = Tabs

const LeagueStats = ({ data, loading }: { data: League, loading: boolean }) => {
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
      title: 'Teams', 
      value: data.teams?.length || 0,
      icon: <TeamOutlined className="text-blue-500" />,
    },
    { 
      title: 'Matches', 
      value: data.matches?.length || 0,
      icon: <TrophyOutlined className="text-green-500" />,
    },
    { 
      title: 'Prize Pool', 
      value: `KSh ${data.prizePool?.toLocaleString() || 0}`,
      icon: <CrownOutlined className="text-yellow-500" />,
    },
    { 
      title: 'Registration Fee', 
      value: `KSh ${data.registrationFee?.toLocaleString() || 0}`,
      icon: <StarOutlined className="text-purple-500" />,
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
            <div className="text-2xl">
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LeagueDetailPage() {
    const params = useParams()
    const router = useRouter()
    const toast = useToast()
    const leagueId = params.id as string

    const { user } = useUser();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [league, setLeague] = useState<League | null>(null)
    const [teams, setTeams] = useState<TeamTypes[] | null>(null)
    const [users, setUsers] = useState<UserType[] | null>(null)
    const [matches, setMatches] = useState<MatchTypes[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        const fetchLeague = async () => {
        if (!leagueId) return
        
        setLoading(true)
        try {
            const response = await leaguesAPI.getById(leagueId)
            const usersResponse = await userAPI.getAll()
            const teamsResponse = await teamsAPI.getAll()
            const matchesResponse = await matchesAPI.getAll()
            console.log("League fetched:", response)
            console.log("Users fetched:", usersResponse)
            console.log("Teams fetched:", teamsResponse)
            console.log("Matches fetched:", matchesResponse)
            setLeague(response.data || response)
            setUsers(usersResponse.data || usersResponse)
            setTeams(teamsResponse.data || teamsResponse)
            setMatches(matchesResponse.data || matchesResponse)
        } catch (error) {
            console.error('Error fetching league:', error)
            toast.error('Failed to load league details')
        } finally {
            setLoading(false)
        }
        }

        fetchLeague()
    }, [leagueId, refresh])

    const handleDeleteLeague = async () => {
        if (!league?._id) return
        
        try {
        // Check if delete method exists, otherwise use a workaround
        if ('delete' in leaguesAPI) {
            await leaguesAPI.delete(league._id)
        } else {
            // Fallback - you can implement this later
            console.log('Delete method not available yet')
            toast.error('Delete functionality is not yet implemented')
            return
        }
        toast.success('League deleted successfully')
        router.push('/admin/leagues')
        } catch (error) {
        console.error('Error deleting league:', error)
        toast.error('Failed to delete league')
        }
    }

    const handleRefresh = () => {
    console.log('handleRefresh called - current refresh state:', refresh)
    setRefresh(prev => {
      console.log('Toggling refresh from', prev, 'to', !prev)
      return !prev
    })
  }

    const teamColumns = [
        {
        title: 'Team Name',
        key: 'name',
        render: (team: TeamTypes) => (
            <Space>
            <Avatar icon={<TeamOutlined />} />
                <span>{team.name}</span>
            </Space>
        ),
        },
        {
        title: 'Captain',
        key: 'captain',
        render: (team: TeamTypes) => (
            team.captain ? `${team.captain.first_name} ${team.captain.second_name}` : 'N/A'
        ),
        },
        {
        title: 'Members',
        key: 'members',
        render: (team: TeamTypes) => team.members?.length || 0,
        },
        {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => (
            <Tag color={status === 'active' ? 'green' : 'default'}>
            {(status || 'Active').toUpperCase()}
            </Tag>
        ),
        },
        {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
        render: (points: number) => points || 0,
        },
    ]

    const standingsColumns = [
        {
        title: 'Position',
        dataIndex: 'position',
        key: 'position',
        render: (position: number) => (
            <div className="flex items-center">
            <span className="font-bold">{position}</span>
            </div>
        ),
        },
        {
        title: 'Team',
        key: 'team',
        render: (standing: any) => {
            const team = teams?.find(t => t._id === standing.teamId)
            return (
            <Space>
                <Avatar icon={<TeamOutlined />} />
                <span>{team?.name || 'Unknown Team'}</span>
            </Space>
            )
        },
        },
        {
        title: 'Played',
        dataIndex: 'matchesPlayed',
        key: 'matchesPlayed',
        },
        {
        title: 'Won',
        dataIndex: 'wins',
        key: 'wins',
        },
        {
        title: 'Drawn',
        dataIndex: 'draws',
        key: 'draws',
        },
        {
        title: 'Lost',
        dataIndex: 'losses',
        key: 'losses',
        },
        {
        title: 'Points',
        dataIndex: 'points',
        key: 'points',
        render: (points: number) => (
            <span className="font-bold">{points}</span>
        ),
        },
    ]

    const matchColumns = [
       
        {
        title: 'Home Team',
        dataIndex: 'homeTeam',
        key: 'homeTeam',
        render: (homeTeam: TeamTypes) => homeTeam?.name,
        },
        {
        title: 'Away Team',
        dataIndex: 'awayTeam',
        key: 'awayTeam',
        render: (awayTeam: TeamTypes) => awayTeam?.name,
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
        render: (match: MatchTypes) => {
            if (match?.score && match.score.home !== undefined && match.score.away !== undefined) {
                return `${match.score.home} - ${match.score.away}`;
            }
            return match?.status === 'scheduled' ? '-' : 'N/A';
        },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: any) => (
                <div className='flex gap-2'>
                    <button onClick={() => handleMatchModalOpen('Edit', item)} className='px-2 flex flex-row gap-2 items-center py-1 border border-gray-300 text-sm rounded-lg hover:bg-gray-100 transition-colors'>
                        Edit
                    </button>
                </div>
            ),
        },
    ]

    console.log('League:', league?.teams)

    // Modal Functions
    const [modalType, setModalType] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedData, setSelectedData] = useState<any>(null)

    // open league modal
    const handleModalClose = () => {
        setIsModalOpen(false)
        setModalType('')
        setSelectedData(null)
    }

    const handleModalOpen = (type : string, item?: any) => {
        setModalType(type)
        setIsModalOpen(true)
        item.users = users
        item.currentLeague = league
        setSelectedData(item || null)
    }  

    // open match modal
    const [matchModalType, setMatchModalType] = useState<string>('')
    const [isMatchModalOpen, setIsMatchModalOpen] = useState(false)

    const handleMatchModalOpen = (type: string, item?: any) => {
        setMatchModalType(type)
        setIsMatchModalOpen(true)
        item.users = users
        item.teams = teams
        item.currentLeague = league
        item.currentUser = user
        setSelectedData(item || null)
    }

    // open league team modal
    const [leagueTeamModalType, setLeagueTeamModalType] = useState<string>('')
    const [isLeagueTeamModalOpen, setIsLeagueTeamModalOpen] = useState(false)

    const handleLeagueTeamModalOpen = () => {
        setIsLeagueTeamModalOpen(true)
    }

    return (
        <div className='flex min-h-screen bg-gray-50'>
        <SideMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <LoadingScreen 
            isLoading={loading}
            title="Loading League Details"
            description="Please wait while we fetch the league information..."
        />
        
        <div className='flex-1 flex flex-col'>
            {/* Top Header for Mobile */}
            <div className="md:hidden bg-white shadow-sm border-b border-gray-200 p-4 pl-16">
            <h1 className="text-xl font-bold text-gray-800">League Details</h1>
            </div>
            
            {/* Main Content */}
            <div className='flex-1 p-4 md:p-6 overflow-x-hidden'>
            {!loading && !league && (
                <div className="flex flex-col items-center justify-center h-96">
                <TrophyOutlined className="text-6xl text-gray-300 mb-4" />
                <Title level={3} type="secondary">League Not Found</Title>
                <Text type="secondary" className="mb-4">
                    The league you're looking for doesn't exist or has been removed.
                </Text>
                <Button 
                    type="primary" 
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.push('/admin/leagues')}
                    className="bg-[#3A8726FF]"
                >
                    Back to Leagues
                </Button>
                </div>
            )}
            
            {!loading && league && (
                <>
                {/* Breadcrumb and Header */}
                <div className="mb-6">
                    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Link href="/admin" className="hover:text-[#3A8726FF]">Admin</Link>
                    <span>/</span>
                    <Link href="/admin/leagues" className="hover:text-[#3A8726FF]">Leagues</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{league.title}</span>
                    </nav>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex items-start gap-4">
                        <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => router.push('/admin/leagues')}
                        className="hidden sm:flex"
                        >
                        Back to Leagues
                        </Button>
                        
                    </div>
                    <div className="flex gap-3">
                        <Button 
                        icon={<EditOutlined />} 
                        type="primary"
                        className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
                        onClick={() => handleModalOpen('Edit', league)}
                        >
                        Edit League
                        </Button>
                        
                    </div>
                    </div>
                </div>
                <div className='mb-6 px-2'>
                    <Title level={2} className="!mb-1">{league.title}</Title>
                    <Text type="secondary">
                        {league.season} Season • Started {new Date(league.startDate).toLocaleDateString()}
                    </Text>
                </div>

                {/* League Stats */}
                <LeagueStats data={league} loading={loading} />

                {/* Main Content Tabs */}
                <Card>
                    <Tabs defaultActiveKey="overview" size="large">
                        {/* Overview */}
                        <TabPane tab="Overview" key="overview">
                            <Row gutter={24}>
                            <Col xs={24} lg={12}>
                                <Card title="League Information" className="mb-4">
                                <Space direction="vertical" className="w-full">
                                    <div>
                                    <Text strong>League Name:</Text>
                                    <div>{league.title}</div>
                                    </div>
                                    <div>
                                    <Text strong>Season:</Text>
                                    <div>{league.season}</div>
                                    </div>
                                    <div>
                                    <Text strong>Category:</Text>
                                    <div>{league.category}</div>
                                    </div>
                                    <div>
                                    <Text strong>Level:</Text>
                                    <div>{league.level}</div>
                                    </div>
                                    <div>
                                    <Text strong>Status:</Text>
                                    <div>
                                        <Tag color={
                                        league.status === 'active' ? 'green' : 
                                        league.status === 'upcoming' ? 'blue' : 'default'
                                        }>
                                        {league.status.toUpperCase()}
                                        </Tag>
                                    </div>
                                    </div>
                                    <div>
                                    <Text strong>Prize Pool:</Text>
                                    <div>KSh {league.prizePool?.toLocaleString() || 0}</div>
                                    </div>
                                    <div>
                                    <Text strong>Registration Fee:</Text>
                                    <div>KSh {league.registrationFee?.toLocaleString() || 0}</div>
                                    </div>
                                </Space>
                                </Card>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Card title="League Schedule" className="mb-4">
                                <Space direction="vertical" className="w-full">
                                    <div>
                                    <Text strong>Start Date:</Text>
                                    <div>{new Date(league.startDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                    <Text strong>End Date:</Text>
                                    <div>{new Date(league.endDate).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                    <Text strong>Duration:</Text>
                                    <div>
                                        {Math.ceil((new Date(league.endDate).getTime() - new Date(league.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </div>
                                    </div>
                                    <div>
                                    <Text strong>Description:</Text>
                                    <div className="text-gray-600">{league.description}</div>
                                    </div>
                                </Space>
                                </Card>
                            </Col>
                            </Row>
                            
                        </TabPane>

                        {/* Teams */}
                        <TabPane tab={`Teams (${league.teams?.length || 0})`} key="teams">
                            <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>League Teams</Title>
                            <Button type="primary" onClick={() => handleLeagueTeamModalOpen()} icon={<PlusOutlined />} className="bg-[#3A8726FF]">
                                Edit Teams
                            </Button>
                            </div>
                            <Table 
                                columns={teamColumns}
                                dataSource={league.teams || []}
                                rowKey="_id"
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 800 }}
                            />
                        </TabPane>

                        {/* Standings */}
                        <TabPane tab="Standings" key="standings">
                            <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>League Standings</Title>
                            </div>
                            <Table 
                                columns={standingsColumns}
                                dataSource={league.standings || []}
                                rowKey={(record, index) => typeof record.teamId === 'string' ? record.teamId : `standing-${index}`}
                                pagination={{ pageSize: 10 }}
                                scroll={{ x: 800 }}
                            />
                        </TabPane>

                        {/* Matches */}
                        <TabPane tab={`Matches (${league.matches?.length || 0})`} key="matches">
                            <div className="mb-4 flex justify-between items-center">
                            <Title level={4}>League Matches</Title>
                            <Button onClick={() => handleMatchModalOpen('Add', league)} type="primary" icon={<PlusOutlined />} className="bg-[#3A8726FF]">
                                Schedule Match
                            </Button>
                            </div>
                            <Table 
                            columns={matchColumns}
                            dataSource={league.matches || []}
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
                <LeaguesModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    setRefresh={handleRefresh}
                    item={selectedData}
                    type={modalType}
                />
            )}

            {isMatchModalOpen && (
                <CreateMatchesModal
                    isOpen={isMatchModalOpen}
                    onClose={() => setIsMatchModalOpen(false)}
                    setRefresh={handleRefresh}
                    item={selectedData}
                    type={matchModalType}
                    user={user || undefined}
                />
            )}
            
            {isLeagueTeamModalOpen && (
                <LeagueTeamModal
                    isOpen={isLeagueTeamModalOpen}
                    onClose={() => setIsLeagueTeamModalOpen(false)}
                    setRefresh={handleRefresh}
                    league={league || undefined}
                />
            )}

        </div>
    )
}
