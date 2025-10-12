import { message, Modal } from 'antd'
import React, { useState } from 'react'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import { FormInput, FormSelect } from '@/components/constants'
import { League, TeamTypes } from '@/types'
import { useUser } from '@/hooks/useUser'
import { leaguesAPI } from '@/utils/api'

interface LeagueModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: () => void  // Changed to a simple function that toggles
  item?: League
  type?: string
}


export default function LeagueModal({ isOpen, onClose, setRefresh, item, type } : LeagueModalProps) {

    const toast = useToast()
    const { user, fullName, isAdmin } = useUser()
    
    // League information state
    const [title, setName] = useState<string>(item?.title || '')
    const [description, setDescription] = useState<string>(item?.description || '')
    const [season, setSeason] = useState<string>(item?.season || '')
    const [status, setStatus] = useState<string>(item?.status || 'upcoming')
    const [category, setCategory] = useState<string>(item?.category || 'Adult')
    const [level, setLevel] = useState<string>(item?.level || 'Amateur')
    const [teams, setTeams] = useState<TeamTypes[]>(item?.teams || [])
    const [prizePool, setPrizePool] = useState<number>(item?.prizePool || 0)
    const [registrationFee, setRegistrationFee] = useState<number>(item?.registrationFee || 0)
    const [startDate, setStartDate] = useState<string>(item?.startDate || '')
    const [endDate, setEndDate] = useState<string>(item?.endDate || '')
    const [numberOfTeams, setNumberOfTeams] = useState<number>(item?.numberOfTeams || 0)

    // Debug the API import on component mount
    React.useEffect(() => {
        console.log('LeagueModal mounted - API check')
    }, [])

    // Function to handle editing league
    const handleEdit = async () => {
        // Logic to edit league
        console.log('Editing league:', item)
        
        // Validate input
        if (!title.trim()) {
            toast.error("Please enter a league title")
            return
        }
        
        if (!description.trim()) {
            toast.error("Please enter a league description")
            return
        }

        // Only include fields that have changed
        const updatedData: Partial<League> = {};
        
        if (title.trim() !== item?.title) {
            updatedData.title = title.trim();
        }
        if (description.trim() !== item?.description) {
            updatedData.description = description.trim();
        }
        if (season.trim() !== item?.season) {
            updatedData.season = season.trim();
        }
        if (status !== item?.status) {
            updatedData.status = status as 'active' | 'upcoming' | 'finished';
        }
        if (category.trim() !== item?.category) {
            updatedData.category = category.trim();
        }
        if (level.trim() !== item?.level) {
            updatedData.level = level.trim();
        }
        if (prizePool !== item?.prizePool) {
            updatedData.prizePool = prizePool;
        }
        if (registrationFee !== item?.registrationFee) {
            updatedData.registrationFee = registrationFee;
        }
        if (startDate !== item?.startDate) {
            updatedData.startDate = startDate;
        }
        if (endDate !== item?.endDate) {
            updatedData.endDate = endDate;
        }

        // Check if any changes were made
        if (Object.keys(updatedData).length === 0) {
            toast.info("No changes detected");
            return;
        }

        try {
            // For now, we'll just simulate API success since leaguesAPI doesn't exist yet
            console.log('League update data:', updatedData);
            toast.success("League updated successfully");
            setRefresh(); // Trigger a refresh after updating
            onClose();
        } catch (error) {
            console.error('Error updating league:', error);
            toast.error("Failed to update league");
        }
    }

    const handleAddLeague = async () => {
        // Logic to add a new league
        console.log('Adding new league')
        
        // Validate input
        if (!title.trim()) {
            toast.error("Please enter a league title")
            return
        }
        
        if (!description.trim()) {
            toast.error("Please enter a league description")
            return
        }
        
        if (!startDate || !endDate) {
            toast.error("Please select start and end dates")
            return
        }
        
        // Data for the new league
        const newLeagueData: Omit<League, 'id'> & { id?: string } = {
            title: title.trim(),
            description: description.trim(),
            season: season.trim(),
            status: status as 'active' | 'upcoming' | 'finished',
            category: category.trim(),
            level: level.trim(),
            numberOfTeams: numberOfTeams,
            teams: [],
            matches: [], // Initialize with 0 matches
            prizePool: prizePool,
            registrationFee: registrationFee,
            startDate: startDate,
            endDate: endDate,
            postedBy: user?._id ,
        };

        console.log("New league data:", newLeagueData);
        
        try {
            // For now, we'll just simulate API success since leaguesAPI doesn't exist yet

            const response = await leaguesAPI.create(newLeagueData);
            console.log('API response:', response)
            
            if(response && (response.data || response.success)) {
                console.log(`Created new league with ID: ${response.data?.id || response.data?._id || 'unknown'}`);
                toast.success("League created successfully");
                console.log('Calling setRefresh after successful league creation')
                setRefresh(); // Trigger a refresh after creating
                onClose();
            } else {
                console.error('Invalid response format:', response)
                toast.error("Unexpected response format from server");
            }
        } catch (error) {
            console.error('Error creating new league:', error);
            const errorMessage = error instanceof Error ? error.message : "Failed to create new league";
            toast.error(errorMessage);
        }
    }

    if(type =='Add'){
        return (
            <Modal
                title="Add League"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleAddLeague}
                onCancel={onClose}
                width={600}
            >
                <div className='flex flex-col gap-4'>
                    <p>Please add all the information requested below:</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormInput label="League Name" value={title} onChange={(e) => setName(e.target.value)} />
                        <FormInput label="Season" value={season} onChange={(e) => setSeason(e.target.value)} placeholder="e.g., 2025" />
                        <div className="md:col-span-2">
                            <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <FormSelect options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Upcoming', value: 'upcoming' },
                            { label: 'Finished', value: 'finished' },
                        ]} label="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
                        <FormSelect options={[
                            { label: 'Adult', value: 'adult' },
                            { label: 'Youth', value: 'youth' },
                            { label: 'Women', value: 'women' },
                            { label: 'Veterans', value: 'veterans' },
                        ]} label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <FormSelect options={[
                            { label: 'Amateur', value: 'amateur' },
                            { label: 'Semi-Pro', value: 'semi-pro' },
                            { label: 'Professional', value: 'professional' },
                        ]} label="Level" value={level} onChange={(e) => setLevel(e.target.value)} />
                        <FormInput type="number" label="Number of Teams" value={numberOfTeams.toString()} onChange={(e) => setNumberOfTeams(parseInt(e.target.value) || 0)} />
                        <FormInput type="number" label="Prize Pool (KSh)" value={prizePool.toString()} onChange={(e) => setPrizePool(parseInt(e.target.value) || 0)} />
                        <FormInput type="number" label="Registration Fee (KSh)" value={registrationFee.toString()} onChange={(e) => setRegistrationFee(parseInt(e.target.value) || 0)} />
                        <FormInput type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <FormInput type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </Modal>
        )   
    } else if(type == 'Edit'){
        return (
            <Modal
                title="Edit League"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEdit}
                onCancel={onClose}
                width={600}
            >
                <div className='flex flex-col gap-4'>
                    <p>Edit the league details here</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormInput label="League Name" value={title} onChange={(e) => setName(e.target.value)} />
                        <FormInput label="Season" value={season} onChange={(e) => setSeason(e.target.value)} />
                        <div className="md:col-span-2">
                            <FormInput label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <FormSelect options={[
                            { label: 'Active', value: 'active' },
                            { label: 'Upcoming', value: 'upcoming' },
                            { label: 'Finished', value: 'finished' },
                        ]} label="Status" value={status} onChange={(e) => setStatus(e.target.value)} />
                        <FormSelect options={[
                            { label: 'Adult', value: 'adult' },
                            { label: 'Youth', value: 'youth' },
                            { label: 'Women', value: 'women' },
                            { label: 'Veterans', value: 'veterans' },
                        ]} label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
                        <FormSelect options={[
                            { label: 'Amateur', value: 'amateur' },
                            { label: 'Semi-Pro', value: 'semi-pro' },
                            { label: 'Professional', value: 'professional' },
                        ]} label="Level" value={level} onChange={(e) => setLevel(e.target.value)} />
                        <FormInput type="number" label="Number of Teams" value={numberOfTeams.toString()} onChange={(e) => setNumberOfTeams(parseInt(e.target.value) || 0)} />
                        <FormInput type="number" label="Prize Pool (KSh)" value={prizePool.toString()} onChange={(e) => setPrizePool(parseInt(e.target.value) || 0)} />
                        <FormInput type="number" label="Registration Fee (KSh)" value={registrationFee.toString()} onChange={(e) => setRegistrationFee(parseInt(e.target.value) || 0)} />
                        <FormInput type="date" label="Start Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <FormInput type="date" label="End Date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>
            </Modal>
        )   
    } else {
        return (
            <Modal
                title="League Information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onCancel={onClose}
                width={600}
            >
                <div className='flex flex-col gap-4'>
                    <p>The following is the league information:</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <BasicTextOutput label="League ID" value={item?._id || 'N/A'} />
                        <BasicTextOutput label="Name" value={item?.title || 'N/A'} />
                        <BasicTextOutput label="Season" value={item?.season || 'N/A'} />
                        <BasicTextOutput label="Status" value={item?.status || 'N/A'} />
                        <div className="md:col-span-2">
                            <BasicTextOutput label="Description" value={item?.description || 'N/A'} />
                        </div>
                        <BasicTextOutput label="Category" value={item?.category || 'N/A'} />
                        <BasicTextOutput label="Level" value={item?.level || 'N/A'} />
                        <BasicTextOutput label="Teams" value={item?.teams?.toString() || '0'} />
                        <BasicTextOutput label="Matches" value={item?.matches?.toString() || '0'} />
                        <BasicTextOutput label="Prize Pool" value={item?.prizePool ? `KSh ${item.prizePool.toLocaleString()}` : 'N/A'} />
                        <BasicTextOutput label="Registration Fee" value={item?.registrationFee ? `KSh ${item.registrationFee.toLocaleString()}` : 'N/A'} />
                        <BasicTextOutput label="Start Date" value={item?.startDate ? new Date(item.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) : 'N/A'} />
                        <BasicTextOutput label="End Date" value={item?.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        }) : 'N/A'} />
                    </div>
                </div>
            </Modal>
        )   
    }

}
