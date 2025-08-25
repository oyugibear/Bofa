// Example usage of FormInput with date support

import React, { useState } from 'react'
import { FormInput, formatDateForInput, formatDateTimeForInput } from '../constants'
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons'

export default function DateInputExample() {
  const [formData, setFormData] = useState({
    eventDate: '',
    eventDateTime: '',
    eventTime: '',
    deadline: ''
  })

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  // Get today's date for min validation
  const today = new Date().toISOString().split('T')[0]
  
  // Get current datetime for min validation
  const now = new Date()
  const currentDateTime = formatDateTimeForInput(now)

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Date Input Examples</h2>
      
      {/* Date Input */}
      <FormInput
        label="Event Date"
        type="date"
        value={formData.eventDate}
        onChange={handleInputChange('eventDate')}
        icon={<CalendarOutlined />}
        min={today} // Prevent past dates
        required
      />

      {/* DateTime Input */}
      <FormInput
        label="Event Date & Time"
        type="datetime-local"
        value={formData.eventDateTime}
        onChange={handleInputChange('eventDateTime')}
        icon={<CalendarOutlined />}
        min={currentDateTime} // Prevent past datetime
        required
      />

      {/* Time Input */}
      <FormInput
        label="Event Time"
        type="time"
        value={formData.eventTime}
        onChange={handleInputChange('eventTime')}
        icon={<ClockCircleOutlined />}
        required
      />

      {/* Date with custom validation */}
      <FormInput
        label="Deadline"
        type="date"
        value={formData.deadline}
        onChange={handleInputChange('deadline')}
        icon={<CalendarOutlined />}
        min={today}
        max="2025-12-31" // Limit to current year
        error={formData.deadline && formData.deadline < today ? 'Deadline cannot be in the past' : undefined}
      />

      {/* Display current values */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Current Values:</h3>
        <pre className="text-sm text-gray-600">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}
