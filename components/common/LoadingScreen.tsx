'use client'

import React from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface LoadingScreenProps {
  /** Whether the loading screen should be visible */
  isLoading?: boolean
  /** Title text displayed below the spinner */
  title?: string
  /** Description text displayed below the title */
  description?: string
  /** Color of the loading spinner */
  spinnerColor?: string
  /** Size of the spinner in pixels */
  spinnerSize?: number
  /** Opacity of the overlay background (0-100) */
  overlayOpacity?: number
  /** Additional CSS classes */
  className?: string
  /** Whether to blur the background content */
  blurBackground?: boolean
  /** Custom spinner component */
  customSpinner?: React.ReactNode
  /** Position of the loading screen */
  position?: 'fixed' | 'absolute'
  /** Background color of the overlay */
  backgroundColor?: string
}

export default function LoadingScreen({
  isLoading = false,
  title = "Loading",
  description = "Please wait while we fetch your data...",
  spinnerColor = "#3A8726FF",
  spinnerSize = 48,
  overlayOpacity = 90,
  className = "",
  blurBackground = false,
  customSpinner,
  position = 'fixed',
  backgroundColor = 'rgba(255, 255, 255, 0.9)'
}: LoadingScreenProps) {
  if (!isLoading) return null

  const defaultSpinner = (
    <Spin 
      indicator={
        <LoadingOutlined 
          style={{ 
            fontSize: spinnerSize, 
            color: spinnerColor 
          }} 
          spin 
        />
      } 
      size="large" 
    />
  )

  return (
    <div 
      className={`inset-0 flex items-center justify-center z-50 ${position} ${blurBackground ? 'backdrop-blur-sm' : ''} ${className}`}
      style={{ 
        backgroundColor: overlayOpacity ? `rgba(255, 255, 255, ${overlayOpacity / 100})` : backgroundColor 
      }}
    >
      <div className="text-center p-8 rounded-lg bg-white/80 backdrop-blur-sm shadow-lg">
        {customSpinner || defaultSpinner}
        
        {(title || description) && (
          <div className="mt-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-700 mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-gray-500 text-sm max-w-xs">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Example usage patterns:
export const LoadingScreenExamples = {
  // Basic loading
  basic: (
    <LoadingScreen 
      isLoading={true}
      title="Loading"
      description="Please wait..."
    />
  ),
  
  // Custom colors and size
  customStyle: (
    <LoadingScreen 
      isLoading={true}
      title="Processing Payment"
      description="Your payment is being processed securely"
      spinnerColor="#ff6b6b"
      spinnerSize={60}
      overlayOpacity={95}
    />
  ),
  
  // With blur background
  withBlur: (
    <LoadingScreen 
      isLoading={true}
      title="Saving Changes"
      description="Your data is being saved"
      blurBackground={true}
      overlayOpacity={70}
    />
  ),
  
  // Absolute positioning for modals
  absolutePosition: (
    <LoadingScreen 
      isLoading={true}
      title="Loading Details"
      position="absolute"
      overlayOpacity={85}
    />
  )
}
