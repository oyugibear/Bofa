'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  startTime: number
}

interface ToastContextType {
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  // Add CSS for progress bar animation
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes toast-progress {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const addToast = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, type, message, startTime: Date.now() }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 4.5 seconds (slightly longer for better UX)
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    }, 4500)
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
      
      {/* Toast Container - Modern Ant Design Style */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999] space-y-3 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              relative flex items-center gap-3 px-5 py-4 rounded-lg backdrop-blur-sm
              transform transition-all ease-in-out pointer-events-auto
              animate-in slide-in-from-top-2 fade-in-0 duration-300
              shadow-xl border border-white/20
              ${toast.type === 'success' 
                ? 'bg-white/95 text-green-700 shadow-green-100/50' 
                : ''
              }
              ${toast.type === 'error' 
                ? 'bg-white/95 text-red-700 shadow-red-100/50' 
                : ''
              }
              ${toast.type === 'info' 
                ? 'bg-white/95 text-blue-700 shadow-blue-100/50' 
                : ''
              }
              hover:shadow-2xl hover:scale-[1.02] transition-all duration-200
              min-w-[320px] max-w-md
            `}
          >
            <div className={`
              flex-shrink-0 w-5 h-5 flex items-center justify-center
              ${toast.type === 'success' ? 'text-green-500' : ''}
              ${toast.type === 'error' ? 'text-red-500' : ''}
              ${toast.type === 'info' ? 'text-blue-500' : ''}
            `}>
              {toast.type === 'success' && (
                <CheckCircleOutlined className="text-lg drop-shadow-sm" />
              )}
              {toast.type === 'error' && (
                <CloseCircleOutlined className="text-lg drop-shadow-sm" />
              )}
              {toast.type === 'info' && (
                <InfoCircleOutlined className="text-lg drop-shadow-sm" />
              )}
            </div>
            
            <div className="flex-1 text-sm font-medium leading-relaxed">
              {toast.message}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                       text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 
                       transition-all duration-200 text-lg leading-none"
              aria-label="Close notification"
            >
              ×
            </button>
            
            {/* Progress bar for auto-dismiss */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/30 rounded-b-lg overflow-hidden">
              <div 
                className={`
                  h-full transition-all ease-linear
                  ${toast.type === 'success' ? 'bg-green-400' : ''}
                  ${toast.type === 'error' ? 'bg-red-400' : ''}
                  ${toast.type === 'info' ? 'bg-blue-400' : ''}
                `}
                style={{
                  animation: 'toast-progress 4.5s linear forwards'
                }}
              />
            </div>
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
