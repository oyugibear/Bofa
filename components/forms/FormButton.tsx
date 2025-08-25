'use client'

import React from 'react'

interface FormButtonProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'danger'
  htmlType?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  size?: 'small' | 'medium' | 'large'
  block?: boolean
  icon?: React.ReactNode
}

const FormButton: React.FC<FormButtonProps> = ({
  children,
  type = 'primary',
  htmlType = 'button',
  onClick,
  loading = false,
  disabled = false,
  className = '',
  size = 'medium',
  block = false,
  icon
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 outline-none focus:ring-2'
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  }
  
  const typeClasses = {
    primary: 'bg-[#3A8726FF] text-white hover:bg-[#2d6b1f] focus:ring-[#3A8726FF] focus:ring-opacity-50',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 focus:ring-opacity-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 focus:ring-opacity-50'
  }
  
  const disabledClasses = 'opacity-50 cursor-not-allowed'
  const blockClasses = block ? 'w-full' : ''

  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${typeClasses[type]}
        ${(disabled || loading) ? disabledClasses : ''}
        ${blockClasses}
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
      {!loading && icon && icon}
      {children}
    </button>
  )
}

export default FormButton
