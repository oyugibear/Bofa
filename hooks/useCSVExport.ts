/**
 * Reusable React hook for CSV exports
 * Provides loading states and error handling
 */

import { useState } from 'react'
import { downloadCSV } from '@/utils/csvExport'

interface UseExportOptions {
  onSuccess?: (message: string) => void
  onError?: (error: string) => void
}

export const useCSVExport = (options: UseExportOptions = {}) => {
  const [isExporting, setIsExporting] = useState(false)

  const exportData = async (
    data: Record<string, any>[],
    filename: string = 'export',
    customOptions?: { includeTimestamp?: boolean }
  ) => {
    setIsExporting(true)
    
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      downloadCSV(data, filename, customOptions)
      
      const message = `${data.length} records exported successfully!`
      options.onSuccess?.(message)
      
      return { success: true, count: data.length, message }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Export failed'
      options.onError?.(errorMessage)
      
      return { success: false, count: 0, message: errorMessage }
    } finally {
      setIsExporting(false)
    }
  }

  return {
    exportData,
    isExporting
  }
}

// Usage example:
/*
import { useCSVExport } from '@/hooks/useCSVExport'
import { message } from 'antd'

const MyComponent = () => {
  const { exportData, isExporting } = useCSVExport({
    onSuccess: (msg) => message.success(msg),
    onError: (error) => message.error(error)
  })

  const handleExport = () => {
    const data = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ]
    
    exportData(data, 'users-export')
  }

  return (
    <button onClick={handleExport} disabled={isExporting}>
      {isExporting ? 'Exporting...' : 'Export CSV'}
    </button>
  )
}
*/