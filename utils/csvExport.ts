/**
 * CSV Export Utility
 * Reusable functions for creating and downloading CSV files
 */

export interface ExportOptions {
  filename?: string
  dateFormat?: 'ISO' | 'locale' | 'short'
  includeTimestamp?: boolean
}

/**
 * Escapes CSV values to handle commas, quotes, and newlines
 */
const escapeCSVValue = (value: any): string => {
  if (value === null || value === undefined) return ''
  
  const stringValue = String(value)
  
  // If the value contains comma, quote, or newline, wrap it in quotes and escape internal quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Converts an array of objects to CSV format
 */
export const arrayToCSV = (data: Record<string, any>[]): string => {
  if (!data || data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0])
  
  // Create header row
  const headerRow = headers.map(escapeCSVValue).join(',')
  
  // Create data rows
  const dataRows = data.map(row => 
    headers.map(header => escapeCSVValue(row[header])).join(',')
  )
  
  return [headerRow, ...dataRows].join('\n')
}

/**
 * Downloads data as a CSV file
 */
export const downloadCSV = (
  data: Record<string, any>[], 
  baseFilename: string = 'export',
  options: ExportOptions = {}
): void => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
    }

    // Generate CSV content
    const csvContent = arrayToCSV(data)
    
    // Generate filename
    const timestamp = options.includeTimestamp !== false 
      ? `-${new Date().toISOString().split('T')[0]}` 
      : ''
    const filename = options.filename || `${baseFilename}${timestamp}.csv`
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url) // Clean up
    } else {
      throw new Error('Download not supported in this browser')
    }
  } catch (error) {
    console.error('CSV Export Error:', error)
    throw error
  }
}

/**
 * Format date for export based on specified format
 */
export const formatDateForExport = (date: string | Date, format: 'ISO' | 'locale' | 'short' = 'locale'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  switch (format) {
    case 'ISO':
      return dateObj.toISOString()
    case 'short':
      return dateObj.toISOString().split('T')[0]
    case 'locale':
    default:
      return dateObj.toLocaleDateString()
  }
}

/**
 * Format currency for export
 */
export const formatCurrencyForExport = (amount: number | string, currency: string = 'KSh'): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return '0'
  }
  
  return `${currency} ${numAmount.toLocaleString()}`
}

/**
 * Clean and format name for export
 */
export const formatNameForExport = (firstName: string = '', lastName: string = ''): string => {
  return `${firstName} ${lastName}`.trim() || 'N/A'
}

/**
 * Booking-specific export formatter
 */
export interface BookingExportData {
  _id: string
  client?: {
    first_name?: string
    second_name?: string
    email?: string
    phone_number?: string
  }
  field?: {
    name?: string
  }
  date_requested: string
  time: string
  duration: string | number
  total_price?: number
  amount?: number
  status: string
  payment_status?: string
  team_name?: string
  createdAt: string
  postedBy?: {
    first_name?: string
    second_name?: string
  }
}

export const formatBookingsForExport = (bookings: BookingExportData[]): Record<string, any>[] => {
  return bookings.map(booking => ({
    'Booking ID': booking._id,
    'Client Name': formatNameForExport(booking.client?.first_name, booking.client?.second_name),
    'Client Email': booking.client?.email || 'N/A',
    'Client Phone': booking.client?.phone_number || 'N/A',
    'Field': booking.field?.name || 'N/A',
    'Date': booking.date_requested,
    'Time': booking.time,
    'Duration (hours)': booking.duration,
    'Total Price': formatCurrencyForExport(booking.total_price || booking.amount || 0),
    'Status': booking.status,
    'Payment Status': booking.payment_status || 'N/A',
    'Team Name': booking.team_name || 'N/A',
    'Created At': formatDateForExport(booking.createdAt),
    'Created By': formatNameForExport(booking.postedBy?.first_name, booking.postedBy?.second_name)
  }))
}

/**
 * Filter bookings by date period
 */
export const filterBookingsByPeriod = (
  bookings: BookingExportData[], 
  period: 'all' | 'today' | 'week' | 'month'
): BookingExportData[] => {
  if (period === 'all') return bookings

  const today = new Date()
  const dateString = today.toISOString().split('T')[0]

  switch (period) {
    case 'today':
      return bookings.filter(booking => booking.date_requested === dateString)
    
    case 'week':
      const weekAgo = new Date()
      weekAgo.setDate(today.getDate() - 7)
      return bookings.filter(booking => new Date(booking.date_requested) >= weekAgo)
    
    case 'month':
      const monthAgo = new Date()
      monthAgo.setMonth(today.getMonth() - 1)
      return bookings.filter(booking => new Date(booking.date_requested) >= monthAgo)
    
    default:
      return bookings
  }
}

/**
 * All-in-one booking export function
 */
export const exportBookings = (
  bookings: BookingExportData[],
  period: 'all' | 'today' | 'week' | 'month' = 'all'
): { success: boolean; count: number; message: string } => {
  try {
    // Filter bookings by period
    const filteredBookings = filterBookingsByPeriod(bookings, period)
    
    if (filteredBookings.length === 0) {
      return {
        success: false,
        count: 0,
        message: `No bookings found for ${period === 'all' ? 'export' : period}`
      }
    }

    // Format data for export
    const exportData = formatBookingsForExport(filteredBookings)
    
    // Download CSV
    downloadCSV(exportData, `bookings-${period}`)
    
    return {
      success: true,
      count: filteredBookings.length,
      message: `${filteredBookings.length} bookings exported successfully!`
    }
  } catch (error) {
    return {
      success: false,
      count: 0,
      message: error instanceof Error ? error.message : 'Export failed'
    }
  }
}