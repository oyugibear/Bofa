/**
 * Example usage of CSV export utility for payments
 * This demonstrates how other pages can use the csvExport utility
 */

import { downloadCSV, arrayToCSV, formatDateForExport, formatCurrencyForExport } from '@/utils/csvExport'

// Example Payment interface
interface Payment {
  _id: string
  amount: number
  status: string
  createdAt: string
  booking_id?: {
    client?: {
      first_name?: string
      second_name?: string
    }
  }
}

/**
 * Format payments for export
 */
export const formatPaymentsForExport = (payments: Payment[]) => {
  return payments.map(payment => ({
    'Payment ID': payment._id,
    'Amount': formatCurrencyForExport(payment.amount),
    'Status': payment.status,
    'Client': payment.booking_id?.client 
      ? `${payment.booking_id.client.first_name} ${payment.booking_id.client.second_name}`.trim()
      : 'N/A',
    'Date': formatDateForExport(payment.createdAt),
  }))
}

/**
 * Export payments to CSV
 */
export const exportPayments = (payments: Payment[]) => {
  try {
    const exportData = formatPaymentsForExport(payments)
    downloadCSV(exportData, 'payments-export')
    return { success: true, message: `${payments.length} payments exported successfully!` }
  } catch (error) {
    return { success: false, message: 'Failed to export payments' }
  }
}

// Usage example in a React component:
/*
import { exportPayments } from '@/utils/paymentExport'

const PaymentsPage = () => {
  const [payments, setPayments] = useState([])
  
  const handleExport = () => {
    const result = exportPayments(payments)
    if (result.success) {
      message.success(result.message)
    } else {
      message.error(result.message)
    }
  }

  return (
    <button onClick={handleExport}>
      Export Payments
    </button>
  )
}
*/