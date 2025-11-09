'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Button, Card, Select, Input, Modal, Form } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CreditCardOutlined, UserOutlined, PhoneOutlined, MailOutlined, TeamOutlined } from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../Providers/ToastProvider'
import { bookingAPI, fieldAPI } from '../../utils/api'
import Link from 'next/link'
import { Field } from '@/types'

interface TimeSlot {
  time: string
  available: boolean
  price: number
}

interface BookingData {
  date: Dayjs | null
  time: string | null
  duration: number
  totalPrice: number
  field: string
  bookingType: 'training' | 'match' | 'tournament' | 'casual'
  teamName?: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  specialRequests?: string
}


interface BookingHistory {
  id: string
  date: string
  time: string
  field: string
  status: 'confirmed' | 'pending' | 'cancelled'
  totalPrice: number
}

export default function FieldBooking() {
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()
  
  // Debug authentication status
  useEffect(() => {
    console.log('FieldBooking Auth Status:', {
      user: user,
      isAuthenticated: isAuthenticated,
      userRole: user?.role,
      userId: user?._id
    })
  }, [user, isAuthenticated])
  
  // Booking state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedField, setSelectedField] = useState<string>('')
  const [duration, setDuration] = useState<number>(1)
  const [bookingType, setBookingType] = useState<'training' | 'match' | 'tournament' | 'casual'>('casual')
  const [teamName, setTeamName] = useState<string>('')
  const [specialRequests, setSpecialRequests] = useState<string>('')
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: user ? `${user.first_name} ${user.second_name}` : '',
    email: user?.email || '',
    phone: user?.phone_number || ''
  })

  // Update contact form when user changes
  useEffect(() => {
    if (user) {
      setContactForm({
        name: `${user.first_name} ${user.second_name}`,
        email: user.email,
        phone: user.phone_number
      })
    }
  }, [user])

  // Available fields - loaded from API
  const [fields, setFields] = useState<Field[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(true)

  // All bookings - loaded once on page load
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)

  // Load fields from API
  useEffect(() => {
    const loadFields = async () => {
      try {
        setFieldsLoading(true)
        const response = await fieldAPI.getAll()
        
        // Transform API response to match our Field interface
        const transformedFields = response.data?.map((field: any) => ({
          _id: field._id,
          name: field.name,
          description: field.description,
          price_per_hour: field.price_per_hour,
          peak_hour_price: field.peak_hour_price,
          weekend_price: field.weekend_price,
          status: field.status,
          isAvailable: field.isAvailable,
          operatingHours: field.operatingHours,
          bookingRules: field.bookingRules,
          lastMaintenance: field.lastMaintenance,
          nextMaintenance: field.nextMaintenance,
          maintenanceNotes: field.maintenanceNotes || [],
          statistics: field.statistics,
          postedBy: field.postedBy,
          managedBy: field.managedBy || [],
          settings: field.settings,
          // Legacy properties for backward compatibility
          capacity: 22, // Default capacity
          features: [], // Default features
          priceMultiplier: 1.0
        })) || []
        
        setFields(transformedFields)
      } catch (error) {
        console.error('Failed to load fields:', error)
        toast.error('Failed to load available fields')
        setFields([]) // No fallback data - use only API data
      } finally {
        setFieldsLoading(false)
      }
    }

    loadFields()
  }, [])

  // Load all bookings when page loads
  console.log("Allbookings: ", allBookings)
  useEffect(() => {
    const loadAllBookings = async () => {
      try {
        setBookingsLoading(true)
        const response = await bookingAPI.getFieldAvailability()
        console.log('All bookings loaded:', response.data)
        // Filter out cancelled bookings and store only date, time, field info
        const activeBookings = response.data.bookedSlots.filter((booking: any) => 
          booking.status !== 'cancelled'
        ).map((booking: any) => ({
          date: booking.date,
          time: booking.time,
          duration: booking.duration,
          field: booking.field._id || booking.field,
          status: booking.status
        }))
        
        setAllBookings(activeBookings)
        console.log('Processed bookings:', activeBookings)
      } catch (error) {
        console.error('Failed to load bookings:', error)
        toast.error('Failed to load booking data')
        setAllBookings([])
      } finally {
        setBookingsLoading(false)
      }
    }

    if (isAuthenticated) {
      loadAllBookings()
    }
  }, [isAuthenticated])

  // Load time slots when date or field changes (wait for bookings to be loaded)
  useEffect(() => {
    if (selectedDate && selectedField && fields.length > 0 && !bookingsLoading) {
      loadTimeSlots(selectedDate.format('YYYY-MM-DD'), selectedField)
    }
  }, [selectedDate, selectedField, fields, bookingsLoading, allBookings])

  // Automatically assign the first available field when fields are loaded
  useEffect(() => {
    if (fields.length > 0 && !selectedField) {
      // Find the first available field, or just use the first field if none are marked available
      const availableField = fields.find(field => field.isAvailable) || fields[0]
      setSelectedField(availableField._id || '')
    }
  }, [fields, selectedField])


  // Available time slots from API
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [timeSlotsLoading, setTimeSlotsLoading] = useState(false)

  // Load available time slots for selected date and field
  // Check if a time slot is booked (considering duration)
  const isTimeSlotBooked = (date: string, fieldId: string, time: string) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD')
    const targetTime = dayjs(`${formattedDate} ${time}`)
    
    return allBookings.some(booking => {
      const bookingDate = dayjs(booking.date).format('YYYY-MM-DD')
      if (bookingDate !== formattedDate || booking.field !== fieldId) {
        return false
      }
      
      const bookingStartTime = dayjs(`${formattedDate} ${booking.time}`)
      const duration = parseInt(booking.duration) || 1
      const bookingEndTime = bookingStartTime.add(duration, 'hour')
      
      // Check if target time falls within the booking period
      return (targetTime.isSame(bookingStartTime) || targetTime.isAfter(bookingStartTime)) && 
             targetTime.isBefore(bookingEndTime)
    })
  }

  // Check if all time slots for a date are booked
  const isDateFullyBooked = (date: Dayjs) => {
    if (!selectedField || allBookings.length === 0) return false
    
    const selectedFieldData = fields.find(f => f._id === selectedField)
    if (!selectedFieldData) return false
    
    const formattedDate = date.format('YYYY-MM-DD')
    const dayOfWeek = date.day()
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
    const currentDayName = dayNames[dayOfWeek]
    
    let totalSlots = 0
    let bookedSlots = 0
    
    if (selectedFieldData.operatingHours) {
      const dayHours = selectedFieldData.operatingHours[currentDayName as keyof typeof selectedFieldData.operatingHours]
      if (dayHours && !dayHours.closed) {
        const startHour = parseInt(dayHours.open.split(':')[0])
        const endHour = parseInt(dayHours.close.split(':')[0])
        totalSlots = endHour - startHour
        
        for (let hour = startHour; hour < endHour; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00`
          if (isTimeSlotBooked(formattedDate, selectedField, timeString)) {
            bookedSlots++
          }
        }
      }
    } else {
      // Default hours 6AM to 10PM = 16 slots
      totalSlots = 16
      for (let hour = 6; hour < 22; hour++) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`
        if (isTimeSlotBooked(formattedDate, selectedField, timeString)) {
          bookedSlots++
        }
      }
    }
    
    return totalSlots > 0 && bookedSlots >= totalSlots
  }

  const loadTimeSlots = async (date: string, fieldId: string) => {
    try {
      setTimeSlotsLoading(true)
      const selectedFieldData = fields.find(f => f._id === fieldId)
      
      console.log('Loading time slots for:', { date, fieldId, allBookings: allBookings.length })
      
      const slots: TimeSlot[] = []
      
      if (selectedFieldData?.operatingHours) {
        // Get current day of week
        const selectedDayOfWeek = dayjs(date).day()
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
        const currentDayName = dayNames[selectedDayOfWeek]
        const dayHours = selectedFieldData.operatingHours[currentDayName as keyof typeof selectedFieldData.operatingHours]
        
        if (dayHours && !dayHours.closed) {
          const startHour = parseInt(dayHours.open.split(':')[0])
          const endHour = parseInt(dayHours.close.split(':')[0])
          
          for (let hour = startHour; hour < endHour; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00`
            
            // Check if this time slot is already booked
            const isBooked = isTimeSlotBooked(date, fieldId, timeString)
            
            // Calculate price based on field pricing and time
            let price = selectedFieldData.price_per_hour
            
            // Peak hours pricing
            const isPeakHour = hour >= 17 && hour <= 21
            if (isPeakHour && selectedFieldData.peak_hour_price) {
              price = selectedFieldData.peak_hour_price
            }
            
            // Weekend pricing
            const isWeekend = selectedDayOfWeek === 0 || selectedDayOfWeek === 6
            if (isWeekend && selectedFieldData.weekend_price) {
              price = selectedFieldData.weekend_price
            }
            
            slots.push({
              time: timeString,
              available: !isBooked,
              price: price
            })
          }
        }
        
        setTimeSlots(slots)
      } else {
        // Fallback default hours if no operating hours specified
        for (let hour = 6; hour < 22; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00`
          
          // Check if this time slot is already booked
          const isBooked = isTimeSlotBooked(date, fieldId, timeString)
          
          slots.push({
            time: timeString,
            available: !isBooked,
            price: selectedFieldData?.price_per_hour || 2000
          })
        }
        setTimeSlots(slots)
      }
    } catch (error) {
      console.error('Failed to load time slots:', error)
      toast.error('Failed to load available time slots')
    } finally {
      setTimeSlotsLoading(false)
    }
  }

  const durations = [
    { value: 1, label: '1 Hour', multiplier: 1 },
    { value: 2, label: '2 Hours', multiplier: 1.8 },
    { value: 3, label: '3 Hours', multiplier: 2.5 },
  ]


  // Calculate current step based on selections (no field selection step)
  const getCurrentStep = () => {
    if (!selectedDate) return 0
    if (!selectedTime) return 1
    if (selectedDate && selectedTime && !loading) return 2
    if (loading) return 3
    return 0
  }

  const disabledDate = (current: Dayjs) => {
    if (!current) return false
    
    // Disable past dates
    if (current < dayjs().endOf('day')) return true
    
    // Disable fully booked dates
    if (!bookingsLoading && selectedField && allBookings.length > 0) {
      return isDateFullyBooked(current)
    }
    
    return false
  }

  const calculatePrice = () => {
    if (!selectedTime || !selectedField) return 0
    const timeSlot = timeSlots.find(slot => slot.time === selectedTime)
    const field = fields.find(f => f._id === selectedField)
    if (!timeSlot || !field) return 0
    
    const durationMultiplier = durations.find(d => d.value === duration)?.multiplier || 1
    
    // Use field's actual pricing structure
    let fieldPrice = field.price_per_hour
    
    // Check if it's peak hours (5 PM to 9 PM) and field has peak pricing
    const currentHour = parseInt(selectedTime!)
    const isPeakHour = currentHour >= 17 && currentHour <= 21
    if (isPeakHour && field.peak_hour_price) {
      fieldPrice = field.peak_hour_price
    }
    
    // Check if it's weekend and field has weekend pricing
    const selectedDayOfWeek = selectedDate?.day()
    const isWeekend = selectedDayOfWeek === 0 || selectedDayOfWeek === 6 // Sunday or Saturday
    if (isWeekend && field.weekend_price) {
      fieldPrice = field.weekend_price
    }
    
    const basePrice = fieldPrice * durationMultiplier
    
    // Add type-based pricing
    const typeMultiplier = {
      casual: 1.0,
      training: 0.9,
      match: 1.2,
      tournament: 1.5
    }[bookingType]
    
    return Math.round(basePrice * typeMultiplier)
  }

  const validateBookingForm = (): boolean => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time')
      return false
    }
    if (!selectedField) {
      toast.error('No field available for booking')
      return false
    }
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      toast.error('Please fill in all contact information')
      return false
    }
    if (bookingType !== 'casual' && !teamName.trim()) {
      toast.error('Please enter team name for this booking type')
      return false
    }
    return true
  }

  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to make a booking')
      return
    }

    if (!validateBookingForm()) {
      return
    }

    setLoading(true)
    try {
      const selectedFieldData = fields.find(f => f._id === selectedField)!
      
      const bookingData = {
        date_requested: selectedDate!.format('YYYY-MM-DD'),
        time: selectedTime!,
        duration: duration,
        total_price: calculatePrice(),
        field: selectedFieldData._id,
        client: user._id // Add user ID for the booking
      }
      
      // Call the real API
      const response = await bookingAPI.create(bookingData)
      console.log('Booking response:', response)

        if (response.data.paymentLink) {
                window.location.href = response.data.paymentLink;
        } else {
            toast.error("Payment link is not available");
        }
      
      toast.success('Field booked successfully! Check your email for confirmation.')
      
      // Reset form
      setSelectedDate(null)
      setSelectedTime(null)
      setDuration(1)
      setCurrentStep(0)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date)
    if (date && !selectedTime) {
      // Auto-scroll to time selection or show a hint
      setTimeout(() => {
        const timeSection = document.getElementById('time-selection')
        if (timeSection) {
          timeSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    if (selectedDate && time) {
      // Auto-scroll to summary
      setTimeout(() => {
        const summarySection = document.getElementById('booking-summary')
        if (summarySection) {
          summarySection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 300)
    }
  }

  const renderPaymentModal = () => (
    <Modal
      title="Payment Confirmation"
      open={showPaymentModal}
      onOk={() => setShowPaymentModal(false)}
      onCancel={() => setShowPaymentModal(false)}
      footer={[
        <Button key="back" onClick={() => setShowPaymentModal(false)}>
          Close
        </Button>,
        <Button key="submit" type="primary" onClick={() => setShowPaymentModal(false)}>
          Pay KES {calculatePrice()}
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <p>Your booking has been confirmed. Please proceed with payment to secure your field.</p>
        <div className="bg-gray-50 p-4 rounded">
          <p><strong>Total Amount:</strong> KES {calculatePrice()}</p>
          <p><strong>Payment Methods:</strong> M-Pesa, Visa, MasterCard</p>
        </div>
      </div>
    </Modal>
  )

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      {bookingsLoading && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            📋 Loading existing bookings to show availability...
          </p>
        </div>
      )}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="h2 mb-2 sm:mb-4 px-4">Reserve Your Slot</h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto px-4">
          Follow these simple steps to reserve our premium football field
        </p>
        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] mx-auto mt-3 sm:mt-4 rounded-full"></div>
      </div>

      {/* Progress Steps */}

      {/* Step Content */}
      <div className="space-y-4 sm:space-y-8 flex flex-col gap-6">
        {/* Step 1: Date Selection */}
        <Card className={`shadow-xl border-0 overflow-hidden transition-all duration-300 ${
          getCurrentStep() === 0 ? 'ring-2 ring-[#3A8726FF] ring-opacity-50' : ''
        } ${!selectedField ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] p-4 rounded sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold">Select Date</h3>
                  <p className="text-green-100 mt-1 text-sm sm:text-base">Choose your preferred booking date</p>
                </div>
              </div>
              {selectedDate && (
                <div className="text-left sm:text-right border border-white bg-opacity-10 rounded-lg p-2 sm:bg-transparent">
                  <div className="text-xs sm:text-sm text-green-100">Selected</div>
                  <div className="font-bold text-sm sm:text-base">{selectedDate.format('MMM D, YYYY')}</div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {!selectedDate && (
              <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs sm:text-sm">
                  📅 <strong>Step 1:</strong> Select a date from the calendar below. You can book up to 30 days in advance.
                </p>
              </div>
            )}
            <div className="calendar-mobile-wrapper">
              <Calendar
                fullscreen={false}
                disabledDate={disabledDate}
                onSelect={handleDateSelect}
                value={selectedDate || undefined}
                className="border-0 mobile-calendar"
              />
            </div>
            {selectedDate && (
              <div className="mt-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-xs sm:text-sm">
                  ✅ Great! You've selected <strong>{selectedDate.format('MMMM D, YYYY')}</strong>. Now choose your time and duration below.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Step 2: Time & Duration Selection */}
        <Card 
          id="time-selection"
          className={`shadow-xl border-0 overflow-hidden transition-all duration-300 ${
            getCurrentStep() === 1 ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${!selectedDate ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold">Time & Duration</h3>
                  <p className="text-blue-100 mt-1 text-sm sm:text-base">Select your time slot and duration</p>
                </div>
              </div>
              {selectedTime && (
                <div className="text-left sm:text-right border border-white bg-opacity-10 rounded-lg p-2 sm:bg-transparent">
                  <div className="text-xs sm:text-sm text-blue-100">Selected</div>
                  <div className="font-bold text-sm sm:text-base">{selectedTime} ({duration}h)</div>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {selectedDate && !selectedTime && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-xs sm:text-sm">
                  ⏰ <strong>Step 2:</strong> First choose how long you'd like to book the field, then select an available time slot.
                </p>
              </div>
            )}
            
            {/* Duration Selection */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Duration</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {durations.map((dur) => (
                  <button
                    key={dur.value}
                    onClick={() => setDuration(dur.value)}
                    disabled={!selectedDate}
                    className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform active:scale-95 sm:hover:scale-105 ${
                      duration === dur.value
                        ? 'border-[#3A8726FF] bg-gradient-to-br from-[#F5FBF4FF] to-white text-[#3A8726FF] shadow-lg'
                        : 'border-gray-200 hover:border-[#3A8726FF] text-gray-700 hover:shadow-md'
                    } ${!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-bold text-base sm:text-lg">{dur.label}</div>
                    <div className="text-xs sm:text-sm opacity-75">×{dur.multiplier} price</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Available Time Slots</h4>
              {timeSlotsLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading available time slots...</p>
                </div>
              ) : timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No time slots available for the selected date</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 max-h-60 sm:max-h-80 overflow-y-auto custom-scrollbar">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available ? handleTimeSelect(slot.time) : null}
                      disabled={!slot.available || !selectedDate}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 transform active:scale-95 sm:hover:scale-105 ${
                        !slot.available
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                          : selectedTime === slot.time
                          ? 'border-[#3A8726FF] bg-gradient-to-br from-[#F5FBF4FF] to-white text-[#3A8726FF] shadow-lg'
                          : 'border-gray-200 hover:border-[#3A8726FF] text-gray-700 hover:shadow-md bg-white'
                      } ${!selectedDate ? 'opacity-30' : ''}`}
                    >
                      <div className="font-bold text-sm sm:text-lg">{slot.time}</div>
                      <div className="text-xs sm:text-sm">
                        {slot.available ? `KES ${slot.price}/hr` : 'Booked'}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {selectedTime && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-xs sm:text-sm">
                  ✅ Perfect! You've selected <strong>{selectedTime}</strong> for <strong>{duration} hour{duration > 1 ? 's' : ''}</strong>. Review your booking below.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Step 3: Booking Summary */}
        {(selectedDate && selectedTime) && (
          <Card 
            id="booking-summary"
            className={`shadow-xl border-0 overflow-hidden transition-all duration-300 ${
              getCurrentStep() === 2 ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
            }`}
          >
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded p-4 sm:p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold">Review & Confirm</h3>
                    <p className="text-orange-100 mt-1 text-sm sm:text-base">Review your booking details before confirming</p>
                  </div>
                </div>
                <div className="text-left sm:text-right border border-white bg-opacity-10 rounded-lg p-2 sm:bg-transparent">
                  <div className="text-xs sm:text-sm text-orange-100">Total</div>
                  <div className="text-xl sm:text-2xl font-bold">KES {calculatePrice()}</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-8">
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-xs sm:text-sm">
                  📋 <strong>Step 3:</strong> Review all details below and click "Confirm Booking" to proceed to payment.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Booking Details - Full Width on Mobile */}
                <div className="w-full">
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">Booking Details</h4>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">📅 Date:</span>
                        <span className="font-bold text-sm sm:text-lg text-gray-800">
                          {selectedDate.format('MMM D, YYYY')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">⏰ Time:</span>
                        <span className="font-bold text-sm sm:text-lg text-gray-800">
                          {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">⏱️ Duration:</span>
                        <span className="font-bold text-sm sm:text-lg text-gray-800">
                          {duration} Hour{duration > 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium text-sm sm:text-base">💰 Base Price:</span>
                        <span className="font-bold text-sm sm:text-lg text-gray-800">
                          KES {timeSlots.find(slot => slot.time === selectedTime)?.price}/hr
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 sm:py-4 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] text-white rounded-lg px-3 sm:px-4">
                        <span className="font-bold text-sm sm:text-lg">💳 Total Price:</span>
                        <span className="font-bold text-lg sm:text-2xl">KES {calculatePrice()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Booking Action - Full Width on Mobile */}
                <div className="w-full">
                  <div className="text-center space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">Ready to book?</h4>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">Secure your field reservation now</p>
                      <div className="text-xs sm:text-sm text-gray-500 space-y-1">
                        <p>✅ Secure payment processing</p>
                        <p>✅ Instant confirmation email</p>
                        <p>✅ 24-hour cancellation policy</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={handleBooking}
                        className="bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] border-none hover:from-[#2d6b1f] hover:to-[#245a19] px-6 sm:px-12 py-6 sm:py-8 h-auto text-lg sm:text-xl font-bold rounded-xl shadow-lg transform transition-all duration-300 active:scale-95 sm:hover:scale-105 w-full sm:w-auto"
                      >
                        {loading ? (
                          <span className="text-sm sm:text-lg">
                            <span className="animate-spin inline-block mr-2">⏳</span>
                            Processing Payment...
                          </span>
                        ) : (
                          <span className="text-sm sm:text-lg">
                            Confirm Booking - KES {calculatePrice()}
                          </span>
                        )}
                      </Button>
                      {!loading && (
                        <p className="text-xs text-gray-400 text-center max-w-xs px-4">
                          By clicking "Confirm Booking", you agree to our terms and conditions
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* Payment Modal */}
        {renderPaymentModal()}
      </div>
    </div>
  )
}


