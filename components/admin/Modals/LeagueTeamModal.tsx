import { Modal, Table, Button, Avatar, Tag, Space, Input, Checkbox } from 'antd'
import React, { useState, useEffect } from 'react'
import { useToast } from '@/components/Providers/ToastProvider'
import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import { League, TeamTypes } from '@/types'
import { useUser } from '@/hooks/useUser'
import { teamsAPI, leaguesAPI } from '@/utils/api'

interface LeagueTeamModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: () => void
  league?: League
  availableTeams?: TeamTypes[]
}

export default function LeagueTeamModal({ isOpen, onClose, setRefresh, league, availableTeams = [] }: LeagueTeamModalProps) {
    const toast = useToast()
    const { user } = useUser()
    
    // State for available teams and selected teams
    const [allTeams, setAllTeams] = useState<TeamTypes[]>(availableTeams)
    const [selectedTeams, setSelectedTeams] = useState<string[]>([])
    const [searchText, setSearchText] = useState('')
    const [loading, setLoading] = useState(false)

    // Get teams already in the league
    const leagueTeamIds = league?.teams?.map(team => 
        typeof team === 'string' ? team : team._id
    ) || []

    // Filter out teams that are already in the league
    const availableTeamsForSelection = allTeams.filter(team => 
        !leagueTeamIds.includes(team._id)
    )

    // Filter teams based on search
    const filteredTeams = availableTeamsForSelection.filter(team =>
        team.name.toLowerCase().includes(searchText.toLowerCase()) ||
        team.captain?.first_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        team.captain?.second_name?.toLowerCase().includes(searchText.toLowerCase())
    )

    useEffect(() => {
        if (isOpen && availableTeams.length === 0) {
            fetchAllTeams()
        }
        
        // Reset selection when modal opens
        if (isOpen) {
            setSelectedTeams([])
            setSearchText('')
        }
    }, [isOpen])

    const fetchAllTeams = async () => {
        setLoading(true)
        try {
            const response = await teamsAPI.getAll()
            setAllTeams(response.data || response)
        } catch (error) {
            console.error('Error fetching teams:', error)
            toast.error('Failed to load teams')
        } finally {
            setLoading(false)
        }
    }


    // Handle team selection
    const handleTeamSelect = (teamId: string, selected: boolean) => {
        if (selected) {
            setSelectedTeams(prev => [...prev, teamId])
        } else {
            setSelectedTeams(prev => prev.filter(id => id !== teamId))
        }
    }

    // Handle select all teams
    const handleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            setSelectedTeams(filteredTeams.map(team => team._id).filter(Boolean) as string[])
        } else {
            setSelectedTeams([])
        }
    }

    // Handle adding selected teams to league
    const handleAddTeamsToLeague = async () => {
        if (selectedTeams.length === 0) {
            toast.error("Please select at least one team")
            return
        }

        if (!league?._id) {
            toast.error("League ID is missing")
            return
        }

        // Show confirmation for adding multiple teams
        if (selectedTeams.length > 3) {
            const teamNames = allTeams
                .filter(team => team._id && selectedTeams.includes(team._id))
                .map(team => team.name)
                .join(', ')

            const confirmed = window.confirm(
                `Are you sure you want to add ${selectedTeams.length} teams to "${league.title}"?\n\nTeams: ${teamNames}`
            )
            
            if (!confirmed) return
        }

        setLoading(true)
        try {
            // Validate selected teams exist in available teams
            const teamsToAdd = allTeams.filter(team => 
                team._id && selectedTeams.includes(team._id)
            )

            if (teamsToAdd.length !== selectedTeams.length) {
                toast.error("Some selected teams are no longer available")
                return
            }

            // Get current league teams (handle both string IDs and populated objects)
            const currentTeamIds = league.teams?.map(team => 
                typeof team === 'string' ? team : team._id
            ).filter(Boolean) as string[] || []

            // Check for duplicates
            const duplicateTeams = selectedTeams.filter(teamId => 
                currentTeamIds.includes(teamId)
            )

            if (duplicateTeams.length > 0) {
                toast.error(`${duplicateTeams.length} team(s) are already in this league`)
                return
            }

            // Combine existing teams with new teams
            const updatedTeamIds = [...currentTeamIds, ...selectedTeams]

            // Get the actual team objects for the update (League interface expects TeamTypes[])
            // We need to get both existing teams and new teams
            const existingTeams = league.teams?.filter(team => team !== null) || []
            const newTeamObjects = teamsToAdd

            const updatedTeams = [...existingTeams, ...newTeamObjects] as TeamTypes[]

            // Update the league with new teams
            const updateData: Partial<League> = {
                teams: updatedTeams,
                numberOfTeams: updatedTeams.length
            }

            console.log('Updating league with teams:', {
                leagueId: league._id,
                currentTeams: currentTeamIds.length,
                newTeams: selectedTeams.length,
                totalTeams: updatedTeamIds.length,
                updateData
            })

            const response = await leaguesAPI.edit(league._id, updateData)

            if (response && (response.success || response.data)) {
                const addedTeamsCount = selectedTeams.length
                const teamNames = teamsToAdd.map(team => team.name).join(', ')
                
                toast.success(
                    `Successfully added ${addedTeamsCount} team(s) to the league: ${teamNames}`
                )
                
                // Clear selection and refresh data
                setSelectedTeams([])
                
                // Refresh available teams by refetching (optional)
                if (availableTeams.length === 0) {
                    await fetchAllTeams()
                }
                
                setRefresh() // Trigger parent refresh to update league data
                onClose()
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (error) {
            console.error('Error adding teams to league:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to add teams to league'
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    // Table columns for team selection
    const columns = [
        {
            title: '',
            key: 'select',
            width: 50,
            render: (team: TeamTypes) => (
                <Checkbox
                    checked={team._id ? selectedTeams.includes(team._id) : false}
                    onChange={(e) => team._id && handleTeamSelect(team._id, e.target.checked)}
                />
            ),
        },
        {
            title: 'Team',
            key: 'team',
            render: (team: TeamTypes) => (
                <Space>
                    <Avatar icon={<TeamOutlined />} />
                    <div>
                        <div className="font-medium">{team.name}</div>
                        <div className="text-gray-500 text-sm">
                            {team.members?.length || 0} members
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Captain',
            key: 'captain',
            render: (team: TeamTypes) => (
                team.captain ? (
                    <Space>
                        <Avatar icon={<UserOutlined />} size="small" />
                        <span>{`${team.captain.first_name} ${team.captain.second_name}`}</span>
                    </Space>
                ) : (
                    <span className="text-gray-400">No Captain</span>
                )
            ),
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

    const isAllSelected = filteredTeams.length > 0 && selectedTeams.length === filteredTeams.length

    return (
        <Modal
            title={`Add Teams to ${league?.title || 'League'}`}
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button
                    key="add"
                    type="primary"
                    onClick={handleAddTeamsToLeague}
                    disabled={selectedTeams.length === 0}
                    loading={loading}
                    className="bg-[#3A8726FF]"
                >
                    Add {selectedTeams.length} Team{selectedTeams.length !== 1 ? 's' : ''} to League
                </Button>,
            ]}
        >
            <div className="flex flex-col gap-4">
                {/* League Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <TeamOutlined className="text-[#3A8726FF]" />
                        <span className="font-medium">League: {league?.title}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        {league?.season} Season • Currently has {league?.teams?.length || 0} teams
                    </div>
                </div>

                {/* Search and Select All */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <Input
                        placeholder="Search teams by name or captain..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="flex-1 max-w-md"
                    />
                    <div className="flex items-center gap-2">
                        <Checkbox
                            checked={isAllSelected}
                            indeterminate={selectedTeams.length > 0 && !isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        >
                            Select All ({filteredTeams.length})
                        </Checkbox>
                    </div>
                </div>

                {/* Available Teams Count */}
                <div className="text-sm text-gray-600">
                    {availableTeamsForSelection.length} teams available to add to this league
                    {searchText && ` • ${filteredTeams.length} teams match your search`}
                </div>

                {/* Teams Table */}
                <div className="border border-gray-200 rounded-lg">
                    <Table
                        columns={columns}
                        dataSource={filteredTeams}
                        rowKey={(record) => record._id || ''}
                        loading={loading}
                        pagination={{
                            pageSize: 8,
                            showSizeChanger: false,
                            showQuickJumper: true,
                        }}
                        scroll={{ y: 400 }}
                        locale={{
                            emptyText: searchText 
                                ? "No teams found matching your search" 
                                : "No teams available to add"
                        }}
                    />
                </div>

                {/* Selection Summary */}
                {selectedTeams.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm">
                            <span className="font-medium text-blue-900">
                                {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
                            </span>
                            <div className="text-blue-700 mt-1">
                                These teams will be added to "{league?.title}" league
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    )
}
