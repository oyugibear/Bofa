import { message, Modal } from 'antd'
import React, { useState } from 'react'
import { bookingAPI, matchesAPI, paymentAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import { FormInput, FormSelect } from '@/components/constants'
import { MatchTypes, TeamTypes, UserType } from '@/types'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: (refresh: boolean) => void
  item: any
  type?: string
}

export default function MatchModal({ isOpen, onClose, setRefresh, item, type } : MatchModalProps) {

    const toast = useToast()
    
    // useState hooks for MatchTypes properties
    const [date, setDate] = useState<string>(item?.date || '')
    const [time, setTime] = useState<string>(item?.time || '')
    const [homeTeam, setHomeTeam] = useState<string>(item?.homeTeam || item?.currentTeam?._id || item?._id || '')
    const [awayTeam, setAwayTeam] = useState<string>(item?.awayTeam || '')
    const [venue, setVenue] = useState<string>(item?.venue || '')
    const [status, setStatus] = useState<string>(item?.status || '')
    const [score, setScore] = useState<{ home: number; away: number }>({
        home: item?.score?.home || 0,
        away: item?.score?.away || 0
    })
    const [postedBy, setPostedBy] = useState<string>(item?.postedBy || '')
    const [editedBy, setEditedBy] = useState<string>(item?.editedBy || '')

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
        if (!date || !time || !awayTeam ) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Prepare match data based on MatchTypes interface
        const newMatchData: Omit<MatchTypes, '_id' | 'createdAt' | 'updatedAt'> = {
            date: date,
            time: time,
            homeTeam: item?.currentTeam?._id,
            awayTeam: awayTeam,
            venue: "Main Field",
            postedBy: item.currentUser._id
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
                title="Add New Match"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleAddMatch}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Please add match information:</p>
                    <div className='flex flex-col gap-2'>
                        <FormInput type='date' label='Date' value={date} onChange={(e) => setDate(e.target.value)} />
                        <FormInput type='time' label='Time' value={time} onChange={(e) => setTime(e.target.value)} />
                        <FormInput 
                            label="Home Team" 
                            value={item?.currentTeam?.name || item?.name || 'Current Team'} 
                            disabled={true}
                            placeholder="Home team (current team)"
                        />
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
                        {/* <FormInput label='Venue' value={venue} onChange={(e) => setVenue(e.target.value)} /> */}
                        {/* <FormInput label='Status' value={status} onChange={(e) => setStatus(e.target.value)} /> */}
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
