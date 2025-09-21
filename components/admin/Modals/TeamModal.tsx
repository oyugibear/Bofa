import { message, Modal } from 'antd'
import React, { useState } from 'react'
import { bookingAPI, teamsAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import Form from 'antd/es/form/Form'
import { FormInput, FormSelect } from '@/components/constants'
import { TeamTypes, UserType } from '@/types'
import { useUser } from '@/hooks/useUser'

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: () => void  // Changed to a simple function that toggles
  item?: any
  type?: string
}

interface UserSelectProps {
  first_name: string
  second_name: string
  _id: string
}


export default function TeamModal({ isOpen, onClose, setRefresh, item, type } : TeamModalProps) {

    const toast = useToast()
    const { user, fullName, isAdmin } = useUser()
    
    // adding team information
    const [name, setName] = useState<string>(item?.name || '')
    const [status, setStatus] = useState(item?.status || '')
    const [members, setMembers] = useState(item?.members || [])
    const [selectedMember, setSelectedMember] = useState<string>('')
    const [captain, setCaptain] = useState<string>(item?.captain || '')

    // Debug the API import on component mount
    React.useEffect(() => {
        console.log('TeamModal mounted - API check:', {
            teamsAPI: !!teamsAPI,
            createMethod: !!teamsAPI?.create,
            allMethods: teamsAPI ? Object.keys(teamsAPI) : 'teamsAPI is undefined'
        })
    }, [])

    // Function to handle editing team status
    const  handleEdit = async () => {
        // Logic to edit team status
        console.log('Editing status for:', item)
        
        if (type === 'Edit Members') {
            // Handle adding member to team
            if (!selectedMember) {
                toast.error("Please select a member to add")
                return
            }
            
            // Check if member is already in the team
            if (members.some((member: any) => member._id === selectedMember || member === selectedMember)) {
                toast.error("This member is already on the team")
                return
            }
            
            // Add the selected member to the members array
            const updatedMembers = [...members, selectedMember]
            
            const updatedData: Partial<TeamTypes> = {
                members: updatedMembers
            };

            try {
                const { data } = await teamsAPI.edit(item._id, updatedData);
                if(data){
                    console.log(`Added member ${selectedMember} to team ${item._id}`);
                    toast.success("Member added to team successfully");
                    console.log('Calling setRefresh after successful member addition')
                    setRefresh(); // Trigger a refresh after updating
                    onClose();
                }
            } catch (error) {
                console.error('Error adding member to team:', error);
                toast.error("Failed to add member to team");
            }
        } else {
            // Handle regular team edit (name/status)
            const updatedData: Partial<TeamTypes> = {
                name: name.trim(),
                status: status.trim(),
                members: members,
                // captain: members.find((member: any) => member._id === captain)
            };

            try {
                const { data } = await teamsAPI.edit(item._id, updatedData);
                if(data){
                    console.log(`Updated team ${item._id} to status: ${status}`);
                    toast.success("Team status updated successfully");
                    console.log('Calling setRefresh after successful team edit')
                    setRefresh(); // Trigger a refresh after updating
                    onClose();
                }
            } catch (error) {
                console.error('Error updating team status:', error);
                toast.error("Failed to update team status");
            }
        }
    }

    const handleAddTeam = async () => {
        // Logic to add a new team
        console.log('Adding new team:', item)
        console.log('teamsAPI object:', teamsAPI)
        console.log('teamsAPI.create function:', teamsAPI?.create)
        
        // Validate input
        if (!name || name.trim() === '') {
            toast.error("Please enter a team name")
            return
        }
        
        // data for the teams
        const newTeamData: TeamTypes = {
            name: name.trim(),
            matches: [],
            members: [],
            postedBy: user?._id
        };

        console.log("new team data:", newTeamData);
        
        // Call API to create a new team here
        try {
            const response = await teamsAPI.create(newTeamData);
            console.log('API response:', response)
            
            if(response && (response.data || response.success)) {
                console.log(`Created new team with ID: ${response.data?.id || response.data?._id || 'unknown'}`);
                toast.success("Team created successfully");
                console.log('Calling setRefresh after successful team creation')
                setRefresh(); // Trigger a refresh after creating
                onClose();
            } else {
                console.error('Invalid response format:', response)
                toast.error("Unexpected response format from server");
            }
        } catch (error) {
            console.error('Error creating new team:', error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create new team";
            toast.error(errorMessage);
        }
    }

    if(type == 'Edit Members'){
        return (
            <Modal
                title="Add Members To Team"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEdit}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Select the member to add to the team</p>
                    <div className='flex flex-col gap-2'>
                        <FormSelect 
                            options={item?.users?.map((p: UserSelectProps) => ({ 
                                label: `${p.first_name} ${p.second_name}`, 
                                value: p._id 
                            })) || []} 
                            label="Select Team Member" 
                            value={selectedMember} 
                            onChange={(e) => setSelectedMember(e.target.value)}
                            placeholder="Choose a member to add..."
                        />
                        
                        {/* Show current members */}
                        {members && members.length > 0 && (
                            <div className="mt-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Current Members:</p>
                                <div className="flex flex-wrap gap-2">
                                    {members.map((member: any, index: number) => (
                                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                                            {typeof member === 'string' ? member : `${member.first_name} ${member.second_name}`}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        )
    } else if(type =='Add'){
        return (
            <Modal
                title="Add Team"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleAddTeam}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Please add all the information requested below:</p>
                    <div className='flex flex-col gap-2'>
                        <FormInput label="Team Name" value={name} onChange={(e) => setName(e.target.value)} />
                        
                    </div>
                </div>
            </Modal>
        )   
    } else if(type == 'Edit'){
        return (
            <Modal
                title="Edit Team Status"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEdit}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Edit the teams details here</p>
                    <div className='flex flex-col gap-2'>
                        <FormInput label="Team Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <FormSelect options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Inactive', value: 'inactive' },
                        ]} label="Team Status" value={status} onChange={(e) => setStatus(e.target.value)} />
                        {/* add this later */}
                        {/* <FormSelect options={item.members.map((member: any) => ({
                            label: `${member.first_name} ${member.second_name}`,
                            value: member._id
                        }))} label="Select Captain" value={captain} onChange={(e) => setCaptain(e.target.value)} /> */}

                    </div>
                </div>
            </Modal>
        )   
    } else {
        return (
            <Modal
                title="Team Information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>The following is the team information:</p>
                    <div className='flex flex-col gap-2'>
                        <BasicTextOutput label="Team ID" value={item.id} />
                        <BasicTextOutput label="Name" value={item.name} />
                        <BasicTextOutput label="Status" value={item.status} />
                        <BasicTextOutput label="Creation Date" value={new Date(item.creationDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })} />
                    </div>
                </div>
            </Modal>
        )   
    }

}
