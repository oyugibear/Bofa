'use client'

import { Card, Statistic } from 'antd'
import { 
  TrophyOutlined, 
  PlayCircleOutlined, 
  TeamOutlined 
} from '@ant-design/icons'
import { League } from '@/types'

interface LeagueStatsProps {
  leagues: League[]
  loading?: boolean
}

export default function LeagueStats({ leagues, loading }: LeagueStatsProps) {
  const activeLeagues = leagues.filter(league => league.status === 'active')
  const totalTeams = leagues.reduce((acc, league) => acc + (league.teams?.length || league.numberOfTeams || 0), 0)
  const totalPrizePool = leagues.reduce((acc, league) => acc + (league.prizePool || 0), 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="text-center" loading={loading}>
        <Statistic
          title="Total Leagues"
          value={leagues.length}
          prefix={<TrophyOutlined />}
          valueStyle={{ color: '#3f8600' }}
        />
      </Card>
      <Card className="text-center" loading={loading}>
        <Statistic
          title="Active Leagues"
          value={activeLeagues.length}
          prefix={<PlayCircleOutlined />}
          valueStyle={{ color: '#1890ff' }}
        />
      </Card>
      <Card className="text-center" loading={loading}>
        <Statistic
          title="Registered Teams"
          value={totalTeams}
          prefix={<TeamOutlined />}
          valueStyle={{ color: '#722ed1' }}
        />
      </Card>
      <Card className="text-center" loading={loading}>
        <Statistic
          title="Total Prize Pool"
          value={totalPrizePool}
          prefix="KSh "
          formatter={(value) => `${Number(value).toLocaleString()}`}
          valueStyle={{ color: '#f5222d' }}
        />
      </Card>
    </div>
  )
}
