'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, type, message }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4000)
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const value: ToastContextType = {
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg max-w-sm
              transform transition-all duration-300 ease-in-out
              ${toast.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-800' : ''}
              ${toast.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' : ''}
              ${toast.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-800' : ''}
            `}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircleOutlined className="text-green-500" />}
              {toast.type === 'error' && <CloseCircleOutlined className="text-red-500" />}
              {toast.type === 'info' && <InfoCircleOutlined className="text-blue-500" />}
            </div>
            
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-2"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
