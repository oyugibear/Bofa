import { Modal, Button, Avatar, Tag, Space, Transfer } from 'antd'
import type { TransferProps } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/Providers/ToastProvider'
import { ReloadOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { League, TeamTypes } from '@/types'
import { leaguesAPI, teamsAPI } from '@/utils/api'

interface LeagueTeamModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: () => void
  league?: League
  availableTeams?: TeamTypes[]
}

type TeamTransferItem = {
  key: string
  title: string
  description: string
  team: TeamTypes
}

const getTeamId = (team: TeamTypes | string) => typeof team === 'string' ? team : team._id || ''

const getCaptainName = (team: TeamTypes) => {
  if (!team.captain) return 'No captain'
  return `${team.captain.first_name || ''} ${team.captain.second_name || ''}`.trim() || 'No captain'
}

export default function LeagueTeamModal({ isOpen, onClose, setRefresh, league, availableTeams = [] }: LeagueTeamModalProps) {
    const toast = useToast()
    const [allTeams, setAllTeams] = useState<TeamTypes[]>([])
    const [targetKeys, setTargetKeys] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const leagueTeamIds = useMemo(() => (
        (league?.teams || []).map(getTeamId).filter(Boolean)
    ), [league])

    const mergeTeams = (primary: TeamTypes[], secondary: TeamTypes[]) => {
        const byId = new Map<string, TeamTypes>()
        primary.concat(secondary).forEach((team) => {
            if (team?._id) byId.set(team._id, team)
        })
        return Array.from(byId.values())
    }

    useEffect(() => {
        if (!isOpen) return

        setTargetKeys(leagueTeamIds)
        setAllTeams(mergeTeams((league?.teams || []) as TeamTypes[], availableTeams))

        const fetchAllTeams = async () => {
            setLoading(true)
            try {
                const response = await teamsAPI.getAll()
                const fetchedTeams = response.data || response || []
                setAllTeams((current) => mergeTeams(current, fetchedTeams))
            } catch (error) {
                console.error('Error fetching teams:', error)
                toast.error('Failed to load teams')
            } finally {
                setLoading(false)
            }
        }

        fetchAllTeams()
    }, [isOpen, leagueTeamIds.join(','), availableTeams.length])

    const transferData: TeamTransferItem[] = useMemo(() => (
        allTeams.map((team) => ({
            key: team._id || '',
            title: team.name,
            description: `${team.members?.length || 0} members • ${getCaptainName(team)}`,
            team,
        })).filter((item) => item.key)
    ), [allTeams])

    const handleChange: TransferProps<TeamTransferItem>['onChange'] = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys as string[])
    }

    const handleReset = () => {
        setTargetKeys(leagueTeamIds)
    }

    const handleSaveTeams = async () => {
        if (!league?._id) {
            toast.error("League ID is missing")
            return
        }

        setLoading(true)
        try {
            const response = await leaguesAPI.edit(league._id, {
                teams: targetKeys as any,
                numberOfTeams: targetKeys.length
            })

            if (response && (response.success || response.data)) {
                toast.success(`Updated ${league.title} teams`)
                setRefresh()
                onClose()
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (error) {
            console.error('Error updating league teams:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to update league teams'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            title={`Edit Teams - ${league?.title || 'League'}`}
            open={isOpen}
            onCancel={onClose}
            width={920}
            footer={[
                <Button key="reset" icon={<ReloadOutlined />} onClick={handleReset}>
                    Reset
                </Button>,
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    onClick={handleSaveTeams}
                    loading={loading}
                    className="bg-[#3A8726FF]"
                >
                    Save {targetKeys.length} Team{targetKeys.length !== 1 ? 's' : ''}
                </Button>,
            ]}
        >
            <div className="flex flex-col gap-4">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="text-sm text-gray-500">Current League</div>
                            <div className="font-semibold text-gray-900">{league?.title}</div>
                        </div>
                        <div className="text-sm text-gray-600">
                            {targetKeys.length} selected from {transferData.length} teams
                        </div>
                    </div>
                </div>

                <Transfer
                    dataSource={transferData}
                    titles={['Available Teams', 'In League']}
                    targetKeys={targetKeys}
                    onChange={handleChange}
                    render={(item) => item.title}
                    showSearch
                    oneWay={false}
                    listStyle={{
                        width: '100%',
                        height: 420,
                    }}
                    filterOption={(inputValue, option) => (
                        option.title.toLowerCase().includes(inputValue.toLowerCase()) ||
                        option.description.toLowerCase().includes(inputValue.toLowerCase())
                    )}
                >
                    {({ direction, filteredItems, selectedKeys, onItemSelect }) => (
                        <div className="h-full overflow-y-auto">
                            {filteredItems.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No teams found
                                </div>
                            ) : filteredItems.map((item) => {
                                const checked = selectedKeys.includes(item.key)
                                const team = item.team

                                return (
                                    <button
                                        key={`${direction}-${item.key}`}
                                        type="button"
                                        onClick={() => onItemSelect(item.key, !checked)}
                                        className={`flex w-full items-center justify-between gap-3 border-b border-gray-100 px-3 py-3 text-left transition-colors hover:bg-gray-50 ${checked ? 'bg-emerald-50' : 'bg-white'}`}
                                    >
                                        <Space>
                                            <Avatar icon={<TeamOutlined />} />
                                            <div>
                                                <div className="font-medium text-gray-900">{team.name}</div>
                                                <div className="text-xs text-gray-500">
                                                    {team.members?.length || 0} members
                                                </div>
                                            </div>
                                        </Space>

                                        <div className="flex flex-col items-end gap-1">
                                            <Tag color={team.status === 'active' ? 'green' : 'default'}>
                                                {(team.status || 'inactive').toUpperCase()}
                                            </Tag>
                                            <span className="flex items-center gap-1 text-xs text-gray-500">
                                                <UserOutlined />
                                                {getCaptainName(team)}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </Transfer>
            </div>
        </Modal>
    )
}
