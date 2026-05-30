import { Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { fieldAPI, leaguesAPI, matchesAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import { FormInput, FormSelect } from '@/components/constants'
import { Field, MatchTypes } from '@/types'
import { User } from '@/lib/auth'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: (refresh: boolean) => void
  item: any
  type?: string
  user?: User
}

export default function CreateMatchesModal({ isOpen, onClose, setRefresh, item, type, user } : MatchModalProps) {

    const toast = useToast()

    const todayInEat = () => new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())

    const formatDateForInput = (value?: string) => {
        if (!value) return todayInEat()
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? todayInEat() : date.toISOString().split('T')[0]
    }

    const timeOptions = useMemo(() => {
        const options: { label: string; value: string }[] = []
        for (let minutes = 6 * 60; minutes <= 21 * 60; minutes += 30) {
            const hours = Math.floor(minutes / 60)
            const mins = minutes % 60
            const value = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
            options.push({ label: value, value })
        }
        return options
    }, [])
    
    // useState hooks for MatchTypes properties
    const [numberOfMatches, setNumberOfMatches] = useState<number>(1)
    const [startDate, setStartDate] = useState<string>(formatDateForInput(item?.startDate))
    const [startTime, setStartTime] = useState<string>('10:00')
    const [venue, setVenue] = useState<string>(item?.venue || '')
    const [fields, setFields] = useState<Field[]>([])
    const [selectedField, setSelectedField] = useState<string>('')
    const [loadingFields, setLoadingFields] = useState(false)
    
    // Original match properties (for edit mode)
    const [date, setDate] = useState<string>(item?.date || '')
    const [time, setTime] = useState<string>(item?.time || '')
    const [homeTeam, setHomeTeam] = useState<string>(item?.homeTeam || item?.currentTeam?._id || item?._id || '')
    const [awayTeam, setAwayTeam] = useState<string>(item?.awayTeam || '')
    const [status, setStatus] = useState<string>(item?.status || '')
    const [score, setScore] = useState<{ home: number; away: number }>({
        home: item?.score?.home || 0,
        away: item?.score?.away || 0
    })
    const [postedBy, setPostedBy] = useState<string>(item?.postedBy || '')
    const [editedBy, setEditedBy] = useState<string>(item?.editedBy || '')

    const activeFields = useMemo(() => (
        fields.filter((field) => field.status === 'active' && field.isAvailable !== false)
    ), [fields])

    const selectedFieldData = activeFields.find((field) => field._id === selectedField)

    useEffect(() => {
        if (!isOpen) return

        const fetchFields = async () => {
            setLoadingFields(true)
            try {
                const response = await fieldAPI.getAll()
                const fieldData = response.data || response || []
                setFields(fieldData)
            } catch (error) {
                console.error('Error fetching fields for match scheduling:', error)
                toast.error('Failed to load fields')
            } finally {
                setLoadingFields(false)
            }
        }

        fetchFields()
    }, [isOpen])

    useEffect(() => {
        if (!selectedField && activeFields.length > 0) {
            setSelectedField(activeFields[0]._id)
        }
    }, [activeFields, selectedField])

    // Function to handle editing match status
    const handleEditStatus = async () => {
        // Logic to edit match status
        console.log('Editing match for:', item)
        
        // Prepare match data - only include fields we want to update
        // Avoid sending empty strings for ObjectId fields
        const matchData: Partial<MatchTypes> = {
            status,
            score,
            ...(user?._id && { editedBy: user._id }) // Only add editedBy if user exists
        }

        console.log('Update match called', matchData);

        try {
            const { data } = await matchesAPI.edit(item._id || item.id, matchData);
            if(data){
                console.log(`Updated match ${item._id || item.id} successfully`);
                toast.success("Match updated successfully");
                setRefresh(true); // Trigger a refresh after updating
                onClose();
            }
        } catch (error) {
            console.error('Error updating match:', error);
            toast.error("Failed to update match");
        }
    }

    // Function to handle adding multiple matches
    const handleCreateMatches = async () => {
        // Validate required fields
        if (!numberOfMatches || numberOfMatches < 1) {
            toast.error("Please specify at least 1 match");
            return;
        }

        // Check if we have enough teams
        const availableTeams = item?.teams?.length || 0;
        
        if (availableTeams < 2) {
            toast.error("At least 2 teams are required to create matches");
            return;
        }

        try {
            const leagueId = item?._id || item?.id;
            
            if (!leagueId) {
                toast.error("League ID not found");
                return;
            }

            const effectiveField = selectedField || activeFields[0]?._id
            const effectiveFieldName = activeFields.find((field) => field._id === effectiveField)?.name
            const effectiveDate = startDate || todayInEat()
            const effectiveTime = startTime || '10:00'

            const response = await leaguesAPI.generateMatches({
                leagueId,
                numberOfMatches,
                startDate: effectiveDate,
                startTime: effectiveTime,
                postedBy: user?._id,
                venue: venue.trim() || effectiveFieldName || 'Main Field',
                ...(effectiveField && { field: effectiveField }),
                intervalMinutes: 60
            });

            console.log('Matches generated successfully:', response);
            
            if (response?.data?.matchesCreated) {
                toast.success(`Successfully created ${response.data.matchesCreated} matches!`);
            } else {
                toast.success(`${numberOfMatches} matches generated successfully!`);
            }
            
            setRefresh(true);
            onClose();
        } catch (error) {
            console.error('Error creating matches:', error);
            toast.error("Failed to create matches. Please try again.");
        }
    }

    console.log(item)
    if(type == "Add"){
        return (
            <Modal
                title="Schedule League Matches"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleCreateMatches}
                onCancel={onClose}
                width={760}
            >
                <div className='flex flex-col gap-5'>
                    <div className='rounded-lg border border-gray-200 bg-white p-4'>
                        <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
                            <div>
                                <div className='text-sm text-gray-500'>League</div>
                                <div className='font-semibold text-gray-900'>{item?.currentLeague?.title || item?.title || 'Unknown League'}</div>
                            </div>
                            <div className='text-sm text-gray-600'>{item?.teams?.length || 0} teams available</div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormInput 
                            type='number' 
                            label='Number of Matches' 
                            value={numberOfMatches.toString()} 
                            onChange={(e) => setNumberOfMatches(parseInt(e.target.value) || 1)}
                            min="1"
                            max="100"
                            placeholder="Enter number of matches"
                        />

                        <FormSelect
                            label="Field"
                            value={selectedField}
                            onChange={(e) => setSelectedField(e.target.value)}
                            placeholder={loadingFields ? 'Loading fields...' : 'Use default field'}
                            options={activeFields.map((field) => ({
                                label: field.name,
                                value: field._id
                            }))}
                            disabled={loadingFields || activeFields.length === 0}
                        />

                        <FormInput
                            type='date'
                            label='Start Date'
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={todayInEat()}
                        />

                        <FormSelect
                            label="Start Time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            options={timeOptions}
                        />

                        <FormInput 
                            label='Venue Name' 
                            value={venue} 
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder={selectedFieldData?.name || 'Main Field'}
                        />
                    </div>

                    <div className='rounded-lg border border-emerald-100 bg-emerald-50 p-4'>
                        <div className='text-sm font-semibold text-emerald-950'>Manager scheduled booking</div>
                        <div className='mt-1 text-sm text-emerald-800'>
                            {numberOfMatches} one-hour match{numberOfMatches === 1 ? '' : 'es'} starting {startDate || todayInEat()} at {startTime || '10:00'} on {selectedFieldData?.name || 'the default field'}.
                        </div>
                    </div>
                </div>
            </Modal>
        )  
    } else if(type == 'Edit'){
        return (
            <Modal
                title="Edit Match Status"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEditStatus}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Edit match information:</p>
                    
                    {/* Match Teams Display */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='font-medium mb-3'>Match Teams</h4>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                            <div>
                                <span className='font-medium text-gray-700'>Home Team:</span>
                                <div className='text-lg font-semibold text-blue-600'>
                                    {item?.homeTeam?.name || 'Unknown Team'}
                                </div>
                            </div>
                            <div>
                                <span className='font-medium text-gray-700'>Away Team:</span>
                                <div className='text-lg font-semibold text-red-600'>
                                    {item?.awayTeam?.name || 'Unknown Team'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <FormInput 
                                label='Home Score' 
                                type='number' 
                                value={score.home.toString()} 
                                onChange={(e) => setScore({...score, home: parseInt(e.target.value) || 0})}
                            />
                            <FormInput 
                                label='Away Score' 
                                type='number' 
                                value={score.away.toString()} 
                                onChange={(e) => setScore({...score, away: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        
                        <FormSelect 
                            label='Match Status' 
                            value={status} 
                            onChange={(e) => setStatus(e.target.value)}
                            options={[
                                { value: 'scheduled', label: 'Scheduled' },
                                { value: 'live', label: 'Live' },
                                { value: 'finished', label: 'Finished' },
                                { value: 'cancelled', label: 'Cancelled' },
                                { value: 'postponed', label: 'Postponed' }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
        )   
    } else {
        return (
            <Modal
                title="Match Information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEditStatus}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>The following is the match information:</p>
                    <div className='flex flex-col gap-2'>
                        <BasicTextOutput label="Match ID" value={item.id} />
                        <BasicTextOutput label="Amount" value={item.amount} />
                        <BasicTextOutput label="Status" value={item.matchStatus} />
                        <BasicTextOutput label="Match Date" value={new Date(item.matchDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })} />
                        <BasicTextOutput label="Match Method" value={item.matchMethod} />
                    </div>
                </div>
            </Modal>
        )   
    }

}
