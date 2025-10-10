import { message, Modal } from 'antd'
import React, { useState } from 'react'
import { bookingAPI, matchesAPI, paymentAPI, leaguesAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'
import { FormInput, FormSelect } from '@/components/constants'
import { MatchTypes, TeamTypes } from '@/types'
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
    
    // useState hooks for MatchTypes properties
    const [numberOfMatches, setNumberOfMatches] = useState<number>(1)
    const [startDate, setStartDate] = useState<string>(item?.startDate || '')
    const [venue, setVenue] = useState<string>(item?.venue || 'Main Field')
    
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

            // Call the generate matches API
            const response = await leaguesAPI.generateMatches({
                leagueId,
                numberOfMatches,
                postedBy: user?._id,
                venue
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
                title="Create League Matches"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleCreateMatches}
                onCancel={onClose}
                width={600}
            >
                <div className='flex flex-col gap-4'>
                    <p>Configure match generation for the league:</p>
                    
                    {/* Match Configuration Section */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h4 className='font-medium mb-3'>League Information</h4>
                        <div className='text-sm text-gray-600'>
                            <div>League: {item?.currentLeague?.title || item?.title || 'Unknown League'}</div>
                            <div>Available Teams: {item?.teams?.length || 0}</div>
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
                        
                        <FormInput 
                            label='Default Venue' 
                            value={venue} 
                            onChange={(e) => setVenue(e.target.value)}
                            placeholder="Enter default venue for matches"
                        />
                    </div>

                    {/* Match Preview Section */}
                    <div className='bg-blue-50 p-4 rounded-lg'>
                        <h4 className='font-medium mb-2 text-blue-900'>Match Generation Preview</h4>
                        <div className='text-sm text-blue-800'>
                            <div>
                                Will generate {numberOfMatches} matches with random team pairings from the available teams.
                            </div>
                            <div className='mt-1'>
                                Matches will be automatically scheduled with appropriate time intervals.
                            </div>
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
