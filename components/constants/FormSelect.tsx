'use client'

import React from 'react'

interface FormSelectProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  options: { value: string; label: string }[]
  icon?: React.ReactNode
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  options,
  icon
}) => {
  return (
    <div className={`w-full ${className}`}>
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
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent outline-none transition-colors appearance-none
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
            hover:border-gray-400 focus:border-[#3A8726FF]
          `}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <span>⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormSelect
