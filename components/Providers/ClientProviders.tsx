'use client'

import { useEffect, useState } from 'react'
import { Providers } from '@/app/GlobalRedux/provider'
import { ReactNode } from 'react'
import { ToastProvider } from './ToastProvider'

export default function ClientProviders({ children }: { children: ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <Providers>
        {children}
      </Providers>
    </ToastProvider>
  )
}
