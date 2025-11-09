"use client"

import BasicHero from '@/components/constants/Heros/BasicHero'
import FieldBooking from '@/components/booking/FieldBooking'
import { AuthGuard } from '../../hooks/useUser'
import React from 'react'

function BookingPage() {
  return (
    <AuthGuard>
      <div className='flex flex-col w-fill items-center justify-center bg-white min-h-screen'>
          <div className='max-w-[1440px] w-full mx-auto p-4 my-8'>
              <FieldBooking />
          </div>
      </div>
    </AuthGuard>
  )
}

export default BookingPage
