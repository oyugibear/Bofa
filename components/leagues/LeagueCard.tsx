'use client'

import { Card, Button, Tag } from 'antd'
import { 
  TrophyOutlined, 
  PlusOutlined, 
  EyeOutlined,
  FireOutlined,
  ThunderboltOutlined,
  CrownOutlined,
  RiseOutlined
} from '@ant-design/icons'
import { League } from '@/types'

interface LeagueCardProps {
  league: League
  onViewDetails: (league: League) => void
  onRegisterTeam: () => void
}

const InfoRow = ({ label, value, color }: { label: string; value: string | number; color?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-medium ${color ? "text-[#3A8726]" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

export default function LeagueCard({ league, onViewDetails, onRegisterTeam }: LeagueCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a'
      case 'upcoming': return '#1890ff'
      case 'finished': return '#8c8c8c'
      default: return '#d9d9d9'
    }
  }

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      'amateur': { icon: <RiseOutlined />, color: '#52c41a' },
      'semi-pro': { icon: <ThunderboltOutlined />, color: '#1890ff' },
      'professional': { icon: <FireOutlined />, color: '#f5222d' },
      'elite': { icon: <CrownOutlined />, color: '#722ed1' }
    }
    
    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.amateur
    
    return (
      <Tag icon={config.icon} color={config.color}>
        {level.toUpperCase()}
      </Tag>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'youth': return '⚽'
      case 'women': return '👩‍⚽'
      case 'veterans': return '🏆'
      case 'adult': return '⚽'
      default: return '⚽'
    }
  }

  // Generate display color based on category or use a default
  const getDisplayColor = () => {
    const colors = {
      'youth': '#4ECDC4',
      'women': '#E74C3C',
      'veterans': '#9B59B6',
      'adult': '#3498DB'
    }
    return colors[league.category as keyof typeof colors] || '#3A8726FF'
  }

  const displayColor = getDisplayColor()

 return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* Banner Section */}
      <div className="relative h-48 w-full overflow-hidden">

        <div
          className="h-full w-full flex flex-col items-center justify-center text-white text-center"
          style={{
            background: `linear-gradient(135deg, ${displayColor}, #2d6b1f)`,
          }}
        >
          <TrophyOutlined className="text-4xl mb-2 opacity-90" />
          <p className="font-medium text-lg tracking-wide">
            {league.season} Season
          </p>
        </div>

        <div className="absolute top-3 left-3">
          <Tag
            color="green"
            className="uppercase text-xs font-semibold rounded-md px-2 py-0.5 bg-white/80 text-[#3A8726] backdrop-blur-sm"
          >
            {league.status}
          </Tag>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col justify-between min-h-[320px]">
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-800 leading-tight">
              {league.title}
            </h3>
            <div className="text-2xl" style={{ color: displayColor }}>
              <TrophyOutlined />
            </div>
          </div>

          {/* <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
            {league.description || "No description available."}
          </p> */}

          {/* Key Info Grid */}
          <div className="flex flex-col text-sm">
            <InfoRow label="Teams" value={league.teams?.length || 0} />
            <InfoRow label="Matches" value={league.matches?.length || 0} />
            <InfoRow
              label="Prize Pool"
              value={`KSh ${(league.prizePool || 0).toLocaleString()}`}
            />
            <InfoRow
              label="Registration"
              value={`KSh ${(league.registrationFee || 0).toLocaleString()}`}
            />
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
            <span>{new Date(league.startDate).toLocaleDateString()}</span>
            <span className="opacity-60">to</span>
            <span>{new Date(league.endDate).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-3">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => onViewDetails(league)}
              className="flex-1 bg-[#3A8726] hover:bg-[#2d6b1f] border-none font-medium rounded-lg transition-all"
            >
              View Details
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={onRegisterTeam}
              className="bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-700 font-medium px-4"
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

}
