'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Calendar, Select, Spin } from 'antd'
import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../Providers/ToastProvider'
import { bookingAPI, fieldAPI } from '../../utils/api'
import { Field } from '@/types'

interface TimeSlot {
  time: string
  available: boolean
  price: number
  reason?: string
}

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const
const KENYA_TIME_ZONE = 'Africa/Nairobi'

const durations = [
  { value: 0.5, label: '30 min', fullLabel: '30 Minutes', multiplier: 0.5 },
  { value: 1, label: '1 hour', fullLabel: '1 Hour', multiplier: 1 },
  { value: 1.5, label: '1.5 hrs', fullLabel: '1.5 Hours', multiplier: 1.4 },
  { value: 2, label: '2 hrs', fullLabel: '2 Hours', multiplier: 1.8 },
  { value: 3, label: '3 hrs', fullLabel: '3 Hours', multiplier: 2.5 },
]

const formatMoney = (amount: number) => `KES ${amount.toLocaleString()}`

const getKenyaNow = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: KENYA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return dayjs(`${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`)
}

const isPaidBooking = (booking: any) => {
  const paymentStatus = String(booking.payment_status || booking.paymentInfo?.payment_status || '').toLowerCase()
  const status = String(booking.status || '').toLowerCase()

  return paymentStatus === 'completed' || paymentStatus === 'paid' || status === 'paid' || status === 'completed'
}

export default function FieldBooking() {
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()

  const [fields, setFields] = useState<Field[]>([])
  const [fieldsLoading, setFieldsLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [allBookings, setAllBookings] = useState<any[]>([])

  const [selectedField, setSelectedField] = useState('')
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(() => getKenyaNow())
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [duration, setDuration] = useState(1)
  const [teamName, setTeamName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadFields = async () => {
      try {
        setFieldsLoading(true)
        const response = await fieldAPI.getAll()
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
        })) || []

        setFields(transformedFields)
        const firstAvailable = transformedFields.find((field: Field) => field.isAvailable && field.status === 'active') || transformedFields[0]
        if (firstAvailable) {
          setSelectedField(firstAvailable._id)
        }
      } catch (error) {
        console.error('Failed to load fields:', error)
        toast.error('Failed to load available fields')
        setFields([])
      } finally {
        setFieldsLoading(false)
      }
    }

    loadFields()
  }, [])

  useEffect(() => {
    const loadAllBookings = async () => {
      try {
        setBookingsLoading(true)
        const response = await bookingAPI.getFieldAvailability()
        const activeBookings = response.data.bookedSlots
          .filter((booking: any) => isPaidBooking(booking))
          .map((booking: any) => ({
            date: booking.date,
            time: booking.time,
            duration: booking.duration,
            field: booking.field?._id || booking.field,
            status: booking.status,
            payment_status: booking.payment_status,
          }))

        setAllBookings(activeBookings)
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

  const selectedFieldData = useMemo(
    () => fields.find((field) => field._id === selectedField),
    [fields, selectedField]
  )

  const selectedDuration = durations.find((item) => item.value === duration) || durations[1]

  const getDayHours = (field: Field | undefined, date: Dayjs) => {
    const dayName = dayNames[date.day()]
    return field?.operatingHours?.[dayName]
  }

  const getSlotPrice = (date: Dayjs, time: string, field: Field) => {
    const hour = Number(time.split(':')[0])
    let price = field.price_per_hour

    if (hour >= 17 && hour <= 21 && field.peak_hour_price) {
      price = field.peak_hour_price
    }

    if ((date.day() === 0 || date.day() === 6) && field.weekend_price) {
      price = field.weekend_price
    }

    return price
  }

  const isWithinAdvanceWindow = (date: Dayjs, field: Field | undefined) => {
    const maxDays = field?.bookingRules?.advanceBookingDays || 30
    return date.startOf('day').isBefore(getKenyaNow().add(maxDays + 1, 'day').startOf('day'))
  }

  const isSlotTooSoon = (slotStart: Dayjs) => {
    return slotStart.isBefore(getKenyaNow().add(1, 'hour'))
  }

  const overlapsExistingBooking = (slotStart: Dayjs, slotEnd: Dayjs, fieldId: string) => {
    return allBookings.some((booking) => {
      const bookingDate = dayjs(booking.date).format('YYYY-MM-DD')
      if (bookingDate !== slotStart.format('YYYY-MM-DD') || booking.field !== fieldId) {
        return false
      }

      const bookingStart = dayjs(`${bookingDate} ${booking.time}`)
      const bookingEnd = bookingStart.add((parseFloat(booking.duration) || 1) * 60, 'minute')
      return slotStart.isBefore(bookingEnd) && slotEnd.isAfter(bookingStart)
    })
  }

  const timeSlots = useMemo<TimeSlot[]>(() => {
    if (!selectedDate || !selectedFieldData || !selectedField) return []

    const dayHours = getDayHours(selectedFieldData, selectedDate)
    if (dayHours?.closed) return []

    const open = dayHours?.open || '06:00'
    const close = dayHours?.close || '22:00'
    const openTime = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${open}`)
    const closeTime = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${close}`)
    const slots: TimeSlot[] = []

    let cursor = openTime
    while (cursor.isBefore(closeTime)) {
      const slotEnd = cursor.add(duration * 60, 'minute')
      const time = cursor.format('HH:mm')
      const price = getSlotPrice(selectedDate, time, selectedFieldData)
      let reason = ''

      if (slotEnd.isAfter(closeTime)) {
        reason = 'Closes soon'
      } else if (isSlotTooSoon(cursor)) {
        reason = 'Soon'
      } else if (overlapsExistingBooking(cursor, slotEnd, selectedField)) {
        reason = 'Booked'
      }

      slots.push({
        time,
        price,
        available: !reason,
        reason,
      })

      cursor = cursor.add(30, 'minute')
    }

    return slots
  }, [allBookings, duration, selectedDate, selectedField, selectedFieldData])

  useEffect(() => {
    if (selectedTime) {
      const slot = timeSlots.find((item) => item.time === selectedTime)
      if (!slot?.available) {
        setSelectedTime(null)
      }
    }
  }, [duration, selectedTime, timeSlots])

  const disabledDate = (current: Dayjs) => {
    if (!current) return false

    if (current.isBefore(getKenyaNow().startOf('day'))) {
      return true
    }

    if (!isWithinAdvanceWindow(current, selectedFieldData)) {
      return true
    }

    if (!selectedFieldData || bookingsLoading) {
      return false
    }

    const dayHours = getDayHours(selectedFieldData, current)
    if (dayHours?.closed) {
      return true
    }

    const open = dayHours?.open || '06:00'
    const close = dayHours?.close || '22:00'
    const openTime = dayjs(`${current.format('YYYY-MM-DD')} ${open}`)
    const closeTime = dayjs(`${current.format('YYYY-MM-DD')} ${close}`)
    let cursor = openTime

    while (cursor.add(duration * 60, 'minute').isSame(closeTime) || cursor.add(duration * 60, 'minute').isBefore(closeTime)) {
      const slotEnd = cursor.add(duration * 60, 'minute')
      if (!isSlotTooSoon(cursor) && !overlapsExistingBooking(cursor, slotEnd, selectedField)) {
        return false
      }
      cursor = cursor.add(30, 'minute')
    }

    return true
  }

  const calculatePrice = () => {
    if (!selectedTime || !selectedFieldData || !selectedDate) return 0

    const basePrice = getSlotPrice(selectedDate, selectedTime, selectedFieldData)
    return Math.round(basePrice * selectedDuration.multiplier)
  }

  const selectedSlot = timeSlots.find((slot) => slot.time === selectedTime)
  const canConfirm = Boolean(selectedDate && selectedTime && selectedFieldData && !loading)

  const handleDateSelect = (date: Dayjs | null) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const validateBookingForm = () => {
    if (!selectedDate || !selectedTime || !selectedFieldData) {
      toast.error('Choose a field, date, and available time.')
      return false
    }

    const slotStart = dayjs(`${selectedDate.format('YYYY-MM-DD')} ${selectedTime}`)
    if (isSlotTooSoon(slotStart)) {
      toast.error('Please choose a time at least one hour from now.')
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
      const bookingData = {
        date_requested: selectedDate!.format('YYYY-MM-DD'),
        time: selectedTime!,
        duration: String(duration),
        total_price: calculatePrice(),
        field: selectedFieldData!._id,
        client: user._id,
        team_name: teamName.trim(),
      }

      const response = await bookingAPI.create(bookingData)

      if (response.data.paymentLink) {
        window.location.href = response.data.paymentLink
      } else {
        toast.error('Payment link is not available')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full bg-[#f7faf6]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-6 overflow-hidden rounded-lg bg-[#193d13] text-white shadow-xl">
          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-[#f6d85b]">
                <CalendarOutlined />
                Field Booking
              </div>
              <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                Reserve your Arena 03 slot
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                Pick a field, choose an available same-day or future slot, and continue to secure payment.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-lg border border-white/15 bg-white/8 p-3 text-center">
              <div>
                <p className="text-lg font-bold text-[#f6d85b]">{fields.length}</p>
                <p className="text-[11px] uppercase tracking-wide text-white/70">Fields</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#f6d85b]">30m</p>
                <p className="text-[11px] uppercase tracking-wide text-white/70">Slots</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#f6d85b]">1hr</p>
                <p className="text-[11px] uppercase tracking-wide text-white/70">Notice</p>
              </div>
            </div>
          </div>
        </div>

        {(fieldsLoading || bookingsLoading) && (
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-100 bg-white p-4 text-sm text-gray-700 shadow-sm">
            <Spin size="small" />
            Loading fields and live availability...
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-5">
            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#3A8726]">Field</p>
                  <h2 className="text-lg font-bold text-gray-950">Choose your pitch</h2>
                </div>
                <EnvironmentOutlined className="text-xl text-[#3A8726]" />
              </div>

              {fields.length === 0 && !fieldsLoading ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                  No fields are currently available.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {fields.map((field) => {
                    const isSelected = field._id === selectedField
                    const disabled = field.status !== 'active' || !field.isAvailable

                    return (
                      <button
                        key={field._id}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setSelectedField(field._id)
                          setSelectedTime(null)
                        }}
                        className={`min-h-[132px] rounded-lg border p-4 text-left transition ${
                          isSelected
                            ? 'border-[#3A8726] bg-[#f1faef] shadow-md'
                            : 'border-gray-200 bg-white hover:border-[#3A8726] hover:shadow-sm'
                        } ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-bold text-gray-950">{field.name}</h3>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-600">{field.description}</p>
                          </div>
                          {isSelected && <CheckCircleOutlined className="text-lg text-[#3A8726]" />}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700">
                            {formatMoney(field.price_per_hour)}/hr
                          </span>
                          <span className={`rounded-full px-2.5 py-1 font-semibold ${
                            field.status === 'active' && field.isAvailable
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {field.status === 'active' && field.isAvailable ? 'Available' : field.status}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1fr)]">
              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3A8726]">Date</p>
                    <h2 className="text-lg font-bold text-gray-950">
                      {selectedDate ? selectedDate.format('ddd, MMM D') : 'Select date'}
                    </h2>
                  </div>
                  <CalendarOutlined className="text-xl text-[#3A8726]" />
                </div>
                <div className="booking-calendar-shell">
                  <Calendar
                    fullscreen={false}
                    disabledDate={disabledDate}
                    onSelect={handleDateSelect}
                    value={selectedDate || undefined}
                    className="booking-calendar"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#3A8726]">Time</p>
                    <h2 className="text-lg font-bold text-gray-950">Available slots</h2>
                  </div>
                  <Select
                    value={duration}
                    onChange={(value) => setDuration(value)}
                    className="w-full sm:w-40"
                    options={durations.map((item) => ({
                      value: item.value,
                      label: item.fullLabel,
                    }))}
                  />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {durations.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setDuration(item.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        duration === item.value
                          ? 'border-[#3A8726] bg-[#3A8726] text-white shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#3A8726]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                {!selectedDate || !selectedFieldData ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    Select a field and date to see times.
                  </div>
                ) : timeSlots.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                    No slots are available for this date.
                  </div>
                ) : (
                  <div className="grid max-h-[390px] grid-cols-2 gap-2 overflow-y-auto pr-1 custom-scrollbar sm:grid-cols-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`min-h-[74px] rounded-lg border p-3 text-left transition ${
                          selectedTime === slot.time
                            ? 'border-[#3A8726] bg-[#f1faef] shadow-md'
                            : slot.available
                            ? 'border-gray-200 bg-white hover:border-[#3A8726] hover:shadow-sm'
                            : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold">{slot.time}</span>
                          {selectedTime === slot.time && <CheckCircleOutlined className="text-[#3A8726]" />}
                        </div>
                        <p className="mt-1 text-xs">
                          {slot.available ? `${formatMoney(slot.price)}/hr` : slot.reason}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#3A8726]">Team</p>
                  <h2 className="text-lg font-bold text-gray-950">Optional booking name</h2>
                </div>
                <TeamOutlined className="text-xl text-[#3A8726]" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-800">Team name</span>
                  <input
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Optional, e.g. Kilifi Stars"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#3A8726] focus:ring-2 focus:ring-[#3A8726]/10"
                  />
                </label>
                <div className="rounded-lg bg-[#f7faf6] p-4 text-sm leading-6 text-gray-600">
                  Your account is used as the booking client. The team name is only needed when you want the reservation labeled for a group.
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
              <div className="bg-[#193d13] p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#f6d85b]">Summary</p>
                <h2 className="mt-1 text-2xl font-bold">{formatMoney(calculatePrice())}</h2>
                <p className="mt-1 text-sm text-white/70">Pay securely after confirmation</p>
              </div>

              <div className="space-y-4 p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">Field</span>
                    <span className="text-right font-semibold text-gray-950">{selectedFieldData?.name || 'Not selected'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">Date</span>
                    <span className="text-right font-semibold text-gray-950">{selectedDate?.format('MMM D, YYYY') || 'Not selected'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">Time</span>
                    <span className="text-right font-semibold text-gray-950">{selectedTime || 'Not selected'}</span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-gray-500">Duration</span>
                    <span className="text-right font-semibold text-gray-950">{selectedDuration.fullLabel}</span>
                  </div>
                  {teamName.trim() && (
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-gray-500">Team</span>
                      <span className="text-right font-semibold text-gray-950">{teamName.trim()}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <ClockCircleOutlined className="text-[#3A8726]" />
                    <span>Same-day booking uses Kenyan time and opens for slots at least one hour from now.</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-sm text-gray-700">
                    <CreditCardOutlined className="text-[#3A8726]" />
                    <span>{selectedSlot ? `${formatMoney(selectedSlot.price)}/hr base rate` : 'Select a slot to see rate'}</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  loading={loading}
                  disabled={!canConfirm}
                  onClick={handleBooking}
                  className="!h-12 !rounded-lg !border-none !bg-[#3A8726] !text-base !font-bold hover:!bg-[#2d6b1f]"
                >
                  {loading ? 'Preparing payment...' : `Confirm ${formatMoney(calculatePrice())}`}
                </Button>

                <p className="text-center text-xs leading-5 text-gray-500">
                  Confirmation redirects you to Paystack to complete payment.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
