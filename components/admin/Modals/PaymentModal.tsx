import { message, Modal } from 'antd'
import React, { useState } from 'react'
import { bookingAPI, paymentAPI } from '@/utils/api'
import { useToast } from '@/components/Providers/ToastProvider'
import BasicTextOutput from '@/components/constants/Outputs/BasicTextOutput'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  setRefresh: (refresh: boolean) => void
  item: any
  type?: string
}

export default function PaymentModal({ isOpen, onClose, setRefresh, item, type } : PaymentModalProps) {

    const [status, setStatus] = useState(item?.status || '')
    const toast = useToast()
    // Function to handle editing payments status
    const  handleEditStatus = async () => {
        // Logic to edit payments status
        console.log('Editing status for:', item)
        onClose();

        // Call API to update payments status here
        try {
            const { data } = await paymentAPI.edit(item.id, status);
            if(data){
                console.log(`Updated payments ${item.id} to status: ${status}`);
                toast.success("Payments status updated successfully");
                setRefresh(true); // Trigger a refresh after updating
            }
        } catch (error) {
            console.error('Error updating payments status:', error);
            toast.error("Failed to update payments status");
        }
    }

    console.log(item)
    if(type == 'Edit'){
        return (
            <Modal
                title="Edit Payment Status"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEditStatus}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>Please select a payments status:</p>
                    <div className='flex flex-col gap-2'>

                    </div>
                </div>
            </Modal>
        )   
    } else {
        return (
            <Modal
                title="Payment Information"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isOpen}
                onOk={handleEditStatus}
                onCancel={onClose}
            >
                <div className='flex flex-col gap-4'>
                    <p>The following is the payment information:</p>
                    <div className='flex flex-col gap-2'>
                        <BasicTextOutput label="Payment ID" value={item.id} />
                        <BasicTextOutput label="Amount" value={item.amount} />
                        <BasicTextOutput label="Status" value={item.paymentStatus} />
                        <BasicTextOutput label="Payment Date" value={new Date(item.paymentDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })} />
                        <BasicTextOutput label="Payment Method" value={item.paymentMethod} />
                    </div>
                </div>
            </Modal>
        )   
    }

}
