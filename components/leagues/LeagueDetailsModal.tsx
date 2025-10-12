'use client'

import { Modal, Tabs, Table, Tag, Avatar, Typography } from 'antd'
import { TrophyOutlined, TeamOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { League } from '@/types'

const { TabPane } = Tabs
const { Text } = Typography

interface LeagueDetailsModalProps {
  visible: boolean
  onClose: () => void
  league: League | null
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface StandingsTeam {
  teamId: {
    _id: string
    name: string
    logo?: string
  }
  name?: string
  position: number
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
}

interface FixtureMatch {
  _id: string
  homeTeam: {
    _id: string
    name: string
  }
  awayTeam: {
    _id: string
    name: string
  }
  date: string
  time: string
  venue: string
  status: string
  homeScore?: number
  awayScore?: number
}

export default function LeagueDetailsModal({ visible, onClose, league, activeTab, setActiveTab }: LeagueDetailsModalProps) {
  
  if (!league) return null

  console.log("League: ", league)
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
      dataIndex: 'position',
      key: 'position',
      width: 50,
      align: 'center',
    },
    {
      title: 'Team',
      key: 'team',
      render: (record) => {
        return (
          <div className="flex items-center gap-2">
            <Avatar size="small" icon={<TeamOutlined />} />
            <Text>{record.teamId?.name || 'Unknown Team'}</Text>
          </div>
        )
      },
    },
    {
      title: 'MP',
      dataIndex: 'matchesPlayed',
      key: 'matchesPlayed',
      width: 50,
      align: 'center',
    },
    {
      title: 'W',
      dataIndex: 'wins',
      key: 'wins',
      width: 40,
      align: 'center',
    },
    {
      title: 'D',
      dataIndex: 'draws',
      key: 'draws',
      width: 40,
      align: 'center',
    },
    {
      title: 'L',
      dataIndex: 'losses',
      key: 'losses',
      width: 40,
      align: 'center',
    },
    {
      title: 'GF',
      dataIndex: 'goalsFor',
      key: 'goalsFor',
      width: 50,
      align: 'center',
    },
    {
      title: 'GA',
      dataIndex: 'goalsAgainst',
      key: 'goalsAgainst',
      width: 50,
      align: 'center',
    },
    {
      title: 'GD',
      dataIndex: 'goalDifference',
      key: 'goalDifference',
      width: 50,
      align: 'center',
      render: (gd) => (
        <span className={gd > 0 ? 'text-green-600' : gd < 0 ? 'text-red-600' : ''}>
          {gd > 0 ? `+${gd}` : gd}
        </span>
      ),
    },
    {
      title: 'Pts',
      dataIndex: 'points',
      key: 'points',
      width: 50,
      align: 'center',
      render: (points) => <Text strong>{points}</Text>,
    },
    {
      title: 'Form',
      dataIndex: 'form',
      key: 'form',
      width: 100,
      align: 'center',
      render: (form: string[]) => (
        <div className="flex gap-1">
          {(form || []).slice(-5).map((result, index) => (
            <Tag key={index} color={getFormColor(result)} className="min-w-[20px] text-center text-xs">
              {result}
            </Tag>
          ))}
        </div>
      ),
    },
  ]

  const fixturesColumns: ColumnsType<FixtureMatch> = [
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Home Team',
      key: 'homeTeam',
      render: (record) => record.homeTeam?.name || 'TBD',
    },
    {
      title: 'Score',
      key: 'score',
      align: 'center',
      render: (record) => {
        if (record.status === 'finished' || record.status === 'completed') {
          // Handle both API formats: record.score.home/away or record.homeScore/awayScore
          const homeScore = record.score?.home ?? record.homeScore ?? 0
          const awayScore = record.score?.away ?? record.awayScore ?? 0
          return `${homeScore} - ${awayScore}`
        }
        return 'vs'
      },
    },
    {
      title: 'Away Team',
      key: 'awayTeam',
      render: (record) => record.awayTeam?.name || 'TBD',
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
      render: (status) => {
        const statusColors = {
          scheduled: 'blue',
          ongoing: 'orange',
          completed: 'green',
          postponed: 'red',
        }
        return (
          <Tag color={statusColors[status as keyof typeof statusColors] || 'default'}>
            {status?.toUpperCase() || 'SCHEDULED'}
          </Tag>
        )
      },
    },
  ]

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <TrophyOutlined className="text-2xl text-blue-500" />
          <div>
            <div className="text-xl font-bold">{league.title}</div>
            <div className="text-sm text-gray-500">{league.season} Season</div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: 1200 }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="overview">
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* League Information */}
                <div className="bg-gray-50/60 rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    League Information
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Status</span>
                      <Tag 
                        color={
                          league.status === "active"
                            ? "green"
                            : league.status === "upcoming"
                            ? "blue"
                            : "default"
                        }
                        className="rounded-full px-3 py-0.5 text-xs font-semibold"
                      >
                        {league.status?.toUpperCase()}
                      </Tag>
                    </div>
                    <div className="flex justify-between">
                      <span>Category</span>
                      <span className="font-medium text-gray-800">{league.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level</span>
                      <span className="font-medium text-gray-800">{league.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Teams</span>
                      <span className="font-medium text-gray-800">
                        {league.teams?.length || league.numberOfTeams || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Matches</span>
                      <span className="font-medium text-gray-800">
                        {league.matches?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="bg-gray-50/60 rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Financial Information
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Prize Pool</span>
                      <span className="font-semibold text-green-700">
                        KSh {(league.prizePool || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Registration Fee</span>
                      <span className="font-medium text-gray-800">
                        KSh {(league.registrationFee || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Start Date</span>
                      <span className="font-medium text-gray-800">
                        {new Date(league.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>End Date</span>
                      <span className="font-medium text-gray-800">
                        {new Date(league.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Description
                </h4>
                <Text className="text-gray-600 leading-relaxed text-sm">
                  {league.description}
                </Text>
              </div>
            </div>
          </TabPane>

        <TabPane tab="Standings" key="standings">
          <Table
            columns={standingsColumns as any}
            dataSource={league.standings as unknown as StandingsTeam[] || []}
            rowKey={(record: any) => record.teamId?._id || record.position || Math.random()}
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
          />
        </TabPane>
        
        <TabPane tab="Fixtures" key="fixtures">
          <Table
            columns={fixturesColumns}
            dataSource={league.matches as any[] || []}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            size="small"
            scroll={{ x: 800 }}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}
