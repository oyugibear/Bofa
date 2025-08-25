'use client'

import React from 'react'

interface FormButtonProps {
  children: React.ReactNode
  type?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
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
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-opacity-50 active:transform active:scale-95'
  
  const sizeClasses = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-3 text-base',
    large: 'px-6 py-4 text-lg'
  }
  
  const typeClasses = {
    primary: 'bg-[#3A8726FF] text-white hover:bg-[#2d6b1f] focus:ring-[#3A8726FF] shadow-md hover:shadow-lg',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-md hover:shadow-lg',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg',
    outline: 'bg-transparent text-[#3A8726FF] border-2 border-[#3A8726FF] hover:bg-[#3A8726FF] hover:text-white focus:ring-[#3A8726FF]'
  }
  
  const disabledClasses = 'opacity-50 cursor-not-allowed transform-none'
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
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      )}
      {!loading && icon && (
        <span className="text-lg">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  )
}

export default FormButton
