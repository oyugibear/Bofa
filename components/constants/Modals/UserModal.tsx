import { message, Modal } from 'antd'
import React, { useState } from 'react'
import FormSelect from '../FormSelect'
import { bookingAPI, userAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '../Outputs/BasicTextOutput'

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: (refresh: boolean) => void
  item: any
}

export default function UserModal({ isOpen, onClose, setRefresh, item } : UserModalProps) {

    const [status, setStatus] = useState(item?.status || '')
    const toast = useToast()
    // Function to handle editing booking status
    const  handleEditStatus = async () => {
        // Logic to edit booking status
        console.log('Editing status for:', item)
        onClose();

        // Call API to update booking status here
        try {
            const { data } = await userAPI.update(item.id, status);
            if(data){
                console.log(`Updated user ${item.id} to status: ${status}`);
                toast.success("User status updated successfully");
                setRefresh(true); // Trigger a refresh after updating
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error("Failed to update user status");
        }
    }

    const options = [
        { value: 'missed', label: 'Missed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'completed', label: 'Completed' },
    ]

  return (
    <Modal
        title="User Details"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isOpen}
        onOk={handleEditStatus}
        onCancel={onClose}
      >
        <div className='flex flex-col gap-4'>
            <p>User Information:</p>
            <div className='flex flex-col gap-2'>
                <BasicTextOutput label="Name" value={item?.names || 'N/A'} />
                <BasicTextOutput label="Email" value={item?.email || 'N/A'} />
                <BasicTextOutput label="Phone" value={item?.phone || 'N/A'} />
                <BasicTextOutput label="Last Activity" value={item?.activity || 'N/A'} />
                <BasicTextOutput label="Joined" value={item?.joined || 'N/A'} />
            </div>
        </div>
    </Modal>
  )
}
