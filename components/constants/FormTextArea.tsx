'use client'

import React from 'react'

interface FormTextAreaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  rows?: number
  icon?: React.ReactNode
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className = '',
  rows = 4,
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
          <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none z-10">
            <div className="text-gray-400 text-lg">
              {icon}
            </div>
          </div>
        )}
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={`
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3A8726FF] focus:border-transparent outline-none transition-colors resize-vertical
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            hover:border-gray-400 focus:border-[#3A8726FF]
          `}
        />
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

export default FormTextArea
