'use client'

import { Button } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  CalendarOutlined, 
  TrophyOutlined 
} from '@ant-design/icons'
import Link from 'next/link'

interface AdminQuickActionsProps {
  onCreateLeague?: () => void
  onManageTeams?: () => void
  onScheduleMatches?: () => void
  onUpdateStandings?: () => void
}

export default function AdminQuickActions({
  onCreateLeague,
  onManageTeams,
  onScheduleMatches,
  onUpdateStandings
}: AdminQuickActionsProps) {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-800 mb-3">Admin Quick Actions</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          size="small" 
          icon={<PlusOutlined />} 
          type="primary"
          onClick={onCreateLeague}
        >
          Create League
        </Button>
        <Button 
          size="small" 
          icon={<EditOutlined />}
          onClick={onManageTeams}
        >
          Manage Teams
        </Button>
        <Button 
          size="small" 
          icon={<CalendarOutlined />}
          onClick={onScheduleMatches}
        >
          Schedule Matches
        </Button>
        <Button 
          size="small" 
          icon={<TrophyOutlined />}
          onClick={onUpdateStandings}
        >
          Update Standings
        </Button>
      </div>
    </div>
  )
}
