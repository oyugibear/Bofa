'use client'

import React from 'react'

// Helper function to format date for input
export const formatDateForInput = (date: Date | string): string => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  
  return `${year}-${month}-${day}`
}

// Helper function to format datetime-local for input
export const formatDateTimeForInput = (date: Date | string): string => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

// Helper function to format time for input
export const formatTimeForInput = (date: Date | string): string => {
  if (!date) return ''
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${hours}:${minutes}`
}

interface FormInputProps {
  label?: string
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'date' | 'datetime-local' | 'time'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  min?: string
  max?: string
}

export type { FormInputProps }

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  icon,
  min,
  max
}) => {
  const isDateType = ['date', 'datetime-local', 'time'].includes(type)
  
  return (
    <div className={`w-full ${className}`}>
      {/* Date Input Styles */}
      {isDateType && (
        <style jsx>{`
          .date-input::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
          
          .date-input::-webkit-datetime-edit {
            color: #374151;
          }
          
          .date-input::-webkit-datetime-edit-fields-wrapper {
            padding: 0;
          }
          
          .date-input::-webkit-datetime-edit-text {
            color: #6B7280;
            padding: 0 0.25rem;
          }
          
          .date-input::-webkit-datetime-edit-month-field,
          .date-input::-webkit-datetime-edit-day-field,
          .date-input::-webkit-datetime-edit-year-field,
          .date-input::-webkit-datetime-edit-hour-field,
          .date-input::-webkit-datetime-edit-minute-field {
            padding: 0 0.125rem;
          }
          
          .date-input:disabled::-webkit-datetime-edit {
            color: #9CA3AF;
          }
        `}</style>
      )}
      
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="text-gray-400 text-lg">
              {icon}
            </div>
          </div>
        )}
        <input
          type={type}
          placeholder={isDateType ? undefined : placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent outline-none transition-colors
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${isDateType ? 'date-input' : ''}
            hover:border-gray-400 focus:border-[#3A8726FF]
          `}
          style={isDateType ? {
            colorScheme: 'light',
            position: 'relative'
          } : undefined}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
      
      {/* Helper text for date inputs */}
      {isDateType && !error && !disabled && (
        <p className="mt-1 text-xs text-gray-500">
          {type === 'date' && 'Select a date'}
          {type === 'datetime-local' && 'Select date and time'}
          {type === 'time' && 'Select time'}
        </p>
      )}
    </div>
  )
}

export default FormInput
