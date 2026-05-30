import { Modal } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { fieldAPI, matchesAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import { FormInput, FormSelect } from '@/components/constants'
import { Field, MatchTypes, TeamTypes } from '@/types'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: (refresh: boolean) => void
  item: any
  type?: string
}

export default function MatchModal({ isOpen, onClose, setRefresh, item, type } : MatchModalProps) {

    const toast = useToast()

    const todayInEat = () => new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Africa/Nairobi',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date())

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
    const [date, setDate] = useState<string>(item?.date || todayInEat())
    const [time, setTime] = useState<string>(item?.time || '10:00')
    const [homeTeam, setHomeTeam] = useState<string>(item?.homeTeam || item?.currentTeam?._id || item?._id || '')
    const [awayTeam, setAwayTeam] = useState<string>(item?.awayTeam || '')
    const [venue, setVenue] = useState<string>(item?.venue || '')
    const [fields, setFields] = useState<Field[]>([])
    const [selectedField, setSelectedField] = useState<string>(typeof item?.field === 'string' ? item.field : item?.field?._id || '')
    const [loadingFields, setLoadingFields] = useState(false)
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
                setFields(response.data || response || [])
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
        
        // Prepare match data based on MatchTypes interface
        const matchData: Partial<MatchTypes> = {
            date,
            time,
            homeTeam,
            awayTeam,
            venue,
            status,
            score,
            postedBy,
            editedBy
        }

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

    // Function to handle adding new match
    const handleAddMatch = async () => {
        // Validate required fields
        const effectiveField = selectedField || activeFields[0]?._id
        const effectiveFieldName = activeFields.find((field) => field._id === effectiveField)?.name

        if (!awayTeam ) {
            toast.error("Please select an away team");
            return;
        }

        // Prepare match data based on MatchTypes interface
        const newMatchData: any = {
            date: date || todayInEat(),
            time: time || '10:00',
            homeTeam: item?.currentTeam?._id,
            awayTeam: awayTeam,
            venue: venue.trim() || effectiveFieldName || "Main Field",
            status: 'scheduled',
            postedBy: item.currentUser._id,
            ...(effectiveField && { field: effectiveField })
        }

        try {
            const { data } = await matchesAPI.create(newMatchData);
            if(data){
                console.log('Created new match successfully');
                toast.success("Match created successfully");
                setRefresh(true); // Trigger a refresh after creating
                onClose();
            }
        } catch (error) {
            console.error('Error creating match:', error);
            toast.error("Failed to create match");
        }
    }

    console.log(item)
    if(type == "Add"){
        return (
            <Modal
                title="Schedule Match"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleAddMatch}
                onCancel={onClose}
                width={760}
            >
                <div className='flex flex-col gap-5'>
                    <div className='rounded-lg border border-gray-200 bg-white p-4'>
                        <FormInput 
                            label="Home Team" 
                            value={item?.currentTeam?.name || item?.name || 'Current Team'} 
                            disabled={true}
                            placeholder="Home team (current team)"
                        />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormSelect 
                            label="Away Team"
                            options={item?.teams?.map((team: TeamTypes) => ({
                                label: team.name,
                                value: team._id || ''
                            })).filter((team: any) => team.value !== homeTeam) || []} 
                            value={awayTeam} 
                            onChange={(e) => setAwayTeam(e.target.value)}
                            placeholder="Select away team"
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

                        <FormInput type='date' label='Date' value={date} min={todayInEat()} onChange={(e) => setDate(e.target.value)} />
                        <FormSelect label='Time' value={time} onChange={(e) => setTime(e.target.value)} options={timeOptions} />
                        <FormInput label='Venue Name' value={venue} placeholder={selectedFieldData?.name || 'Main Field'} onChange={(e) => setVenue(e.target.value)} />
                    </div>

                    <div className='rounded-lg border border-emerald-100 bg-emerald-50 p-4'>
                        <div className='text-sm font-semibold text-emerald-950'>Manager scheduled booking</div>
                        <div className='mt-1 text-sm text-emerald-800'>
                            This match reserves {selectedFieldData?.name || 'the default field'} for one hour without requiring payment.
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
                    <div className='flex flex-col gap-2'>
                        <FormInput label='Date' value={date} onChange={(e) => setDate(e.target.value)} />
                        <FormInput label='Time' value={time} onChange={(e) => setTime(e.target.value)} />
                        <FormInput label='Home Team' value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} />
                        <FormInput label='Away Team' value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} />
                        <FormInput label='Venue' value={venue} onChange={(e) => setVenue(e.target.value)} />
                        <FormInput label='Status' value={status} onChange={(e) => setStatus(e.target.value)} />
                        <FormInput label='Home Score' type='number' value={score.home.toString()} onChange={(e) => setScore({...score, home: parseInt(e.target.value) || 0})} />
                        <FormInput label='Away Score' type='number' value={score.away.toString()} onChange={(e) => setScore({...score, away: parseInt(e.target.value) || 0})} />
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
