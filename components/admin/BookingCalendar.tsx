'use client'

import React, { useMemo, useState } from 'react'
import { Calendar, Card, Modal, Progress, Tag, Tooltip, Typography } from 'antd'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { BookingDetails, Field } from '@/types'
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface BookingCalendarProps {
  bookings: BookingDetails[]
  fields?: Field[]
}

interface BookingEvent {
  id: string
  title: string
  time: string
  duration: number
  clientName: string
  fieldId?: string
  fieldName: string
  status: string
  paymentStatus?: string
}

interface DayAvailability {
  totalSlots: number
  heldSlots: number
  availableSlots: number
  utilization: number
  events: BookingEvent[]
  fieldBreakdown: Array<{
    fieldName: string
    availableSlots: number
    totalSlots: number
  }>
}

const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

const isPaidOrCompleted = (booking: BookingDetails) => {
  const paymentStatus = String(
    booking.paymentInfo?.payment_status || (booking as any).payment_status || ''
  ).toLowerCase()
  const status = String(booking.status || '').toLowerCase()

  return (
    booking.payment_waived === true ||
    booking.booking_type === 'manager_scheduled_match' ||
    paymentStatus === 'completed' ||
    paymentStatus === 'paid' ||
    status === 'completed' ||
    status === 'paid'
  )
}

const getBookingFieldId = (booking: BookingDetails) => {
  if (typeof booking.field === 'string') return booking.field
  return booking.field?._id
}

const getFieldHours = (field: Field, date: Dayjs) => {
  const dayName = dayNames[date.day()]
  const dayHours = field.operatingHours?.[dayName]

  if (dayHours?.closed) return null

  return {
    open: dayHours?.open || '06:00',
    close: dayHours?.close || '22:00',
  }
}

const countFieldSlots = (field: Field, date: Dayjs) => {
  const hours = getFieldHours(field, date)
  if (!hours) return 0

  const openTime = dayjs(`${date.format('YYYY-MM-DD')} ${hours.open}`)
  const closeTime = dayjs(`${date.format('YYYY-MM-DD')} ${hours.close}`)
  let cursor = openTime
  let count = 0

  while (cursor.isBefore(closeTime)) {
    count += 1
    cursor = cursor.add(30, 'minute')
  }

  return count
}

const countHeldSlotsForField = (events: BookingEvent[], fieldId: string) => {
  return events
    .filter((event) => event.fieldId === fieldId)
    .reduce((total, event) => total + Math.max(1, Math.ceil(event.duration * 2)), 0)
}

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'green'
    case 'pending':
      return 'orange'
    case 'cancelled':
      return 'red'
    case 'completed':
      return 'blue'
    case 'paid':
      return 'green'
    default:
      return 'default'
  }
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings, fields = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [isModalVisible, setIsModalVisible] = useState(false)

  const heldBookings = useMemo(() => bookings.filter(isPaidOrCompleted), [bookings])

  const eventsByDate = useMemo(() => {
    const grouped: Record<string, BookingEvent[]> = {}

    heldBookings.forEach((booking) => {
      const bookingDate = dayjs(booking.date_requested).format('YYYY-MM-DD')
      const event: BookingEvent = {
        id: booking._id,
        title: booking.team_name || 'Field Booking',
        time: booking.time || 'No time',
        duration: Number(booking.duration) || 1,
        clientName: booking.client?.first_name && booking.client?.second_name
          ? `${booking.client.first_name} ${booking.client.second_name}`
          : booking.client?.email || 'Unknown Client',
        fieldId: getBookingFieldId(booking),
        fieldName: typeof booking.field === 'string' ? 'Field' : booking.field?.name || 'Field',
        status: booking.status || 'pending',
        paymentStatus: booking.paymentInfo?.payment_status || (booking as any).payment_status,
      }

      if (!grouped[bookingDate]) grouped[bookingDate] = []
      grouped[bookingDate].push(event)
    })

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => a.time.localeCompare(b.time))
    })

    return grouped
  }, [heldBookings])

  const getAvailabilityForDate = (date: Dayjs): DayAvailability => {
    const dateStr = date.format('YYYY-MM-DD')
    const events = eventsByDate[dateStr] || []
    const activeFields = fields.filter((field) => field.status === 'active' && field.isAvailable)

    const fieldBreakdown = activeFields.map((field) => {
      const totalSlots = countFieldSlots(field, date)
      const heldSlots = countHeldSlotsForField(events, field._id)
      const availableSlots = Math.max(0, totalSlots - heldSlots)

      return {
        fieldName: field.name,
        availableSlots,
        totalSlots,
      }
    })

    const totalSlots = fieldBreakdown.reduce((total, field) => total + field.totalSlots, 0)
    const availableSlots = fieldBreakdown.reduce((total, field) => total + field.availableSlots, 0)
    const heldSlots = Math.max(0, totalSlots - availableSlots)
    const utilization = totalSlots > 0 ? Math.round((heldSlots / totalSlots) * 100) : 0

    return {
      totalSlots,
      heldSlots,
      availableSlots,
      utilization,
      events,
      fieldBreakdown,
    }
  }

  const selectedAvailability = getAvailabilityForDate(selectedDate)

  const cellRender = (value: Dayjs) => {
    const availability = getAvailabilityForDate(value)
    const isCurrentMonth = value.month() === selectedDate.month()

    if (!isCurrentMonth && availability.events.length === 0) return null

    const availabilityColor = availability.availableSlots === 0
      ? 'text-red-600'
      : availability.utilization >= 70
      ? 'text-orange-600'
      : 'text-[#3A8726]'

    return (
      <button
        type="button"
        className="w-full rounded-md p-1 text-left transition hover:bg-gray-50"
        onClick={(event) => {
          event.stopPropagation()
          setSelectedDate(value)
          setIsModalVisible(true)
        }}
      >
        <div className={`text-[11px] font-semibold ${availabilityColor}`}>
          {availability.availableSlots}/{availability.totalSlots || 0} open
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#3A8726]"
            style={{ width: `${Math.max(0, 100 - availability.utilization)}%` }}
          />
        </div>
        {availability.events.slice(0, 2).map((booking) => (
          <Tooltip
            key={booking.id}
            title={`${booking.time} • ${booking.fieldName} • ${booking.clientName}`}
            placement="topLeft"
          >
            <Tag
              color={getStatusColor(booking.status)}
              className="mt-1 block max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[10px]"
            >
              {booking.time} {booking.title}
            </Tag>
          </Tooltip>
        ))}
        {availability.events.length > 2 && (
          <div className="mt-1 text-[10px] text-gray-500">+{availability.events.length - 2} more</div>
        )}
      </button>
    )
  }

  const onSelect = (value: Dayjs) => {
    setSelectedDate(value)
    setIsModalVisible(true)
  }

  const onChange: CalendarProps<Dayjs>['onChange'] = (date) => {
    setSelectedDate(date)
  }

  return (
    <>
      <Card className="mb-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[#3A8726]">
              <CalendarOutlined />
              <Text strong className="!text-[#3A8726]">Availability Calendar</Text>
            </div>
            <Title level={4} className="!mb-1">Slots at a glance</Title>
            <Text type="secondary">
              Open slot counts use active fields, paid bookings, and manager scheduled matches as held time.
            </Text>
          </div>
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-2 text-center">
            <div className="px-3 py-2">
              <div className="text-lg font-bold text-[#3A8726]">{selectedAvailability.availableSlots}</div>
              <div className="text-[11px] uppercase text-gray-500">Open</div>
            </div>
            <div className="px-3 py-2">
              <div className="text-lg font-bold text-gray-900">{selectedAvailability.heldSlots}</div>
              <div className="text-[11px] uppercase text-gray-500">Held</div>
            </div>
            <div className="px-3 py-2">
              <div className="text-lg font-bold text-orange-600">{selectedAvailability.utilization}%</div>
              <div className="text-[11px] uppercase text-gray-500">Booked</div>
            </div>
          </div>
        </div>

        <div className="calendar-container">
          <Calendar
            value={selectedDate}
            onChange={onChange}
            onSelect={onSelect}
            dateCellRender={cellRender}
            className="admin-availability-calendar"
          />
        </div>
      </Card>

      <Modal
        title={
          <div>
            <ClockCircleOutlined className="mr-2" />
            Availability for {selectedDate.format('MMMM D, YYYY')}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-gray-700">Booked utilization</span>
              <span className="font-bold text-gray-900">{selectedAvailability.utilization}%</span>
            </div>
            <Progress percent={selectedAvailability.utilization} strokeColor="#3A8726" showInfo={false} />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div>
                <div className="font-bold text-[#3A8726]">{selectedAvailability.availableSlots}</div>
                <div className="text-gray-500">Open slots</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">{selectedAvailability.heldSlots}</div>
                <div className="text-gray-500">Held slots</div>
              </div>
              <div>
                <div className="font-bold text-gray-900">{selectedAvailability.totalSlots}</div>
                <div className="text-gray-500">Total slots</div>
              </div>
            </div>
          </div>

          <div>
            <Text strong>Field availability</Text>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {selectedAvailability.fieldBreakdown.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-gray-500 sm:col-span-2">
                  No active fields available.
                </div>
              ) : selectedAvailability.fieldBreakdown.map((field) => (
                <div key={field.fieldName} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-gray-800">{field.fieldName}</span>
                    <Tag color={field.availableSlots > 0 ? 'green' : 'red'}>
                      {field.availableSlots}/{field.totalSlots} open
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Text strong>Bookings holding slots</Text>
            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto">
              {selectedAvailability.events.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-gray-500">
                  No paid or completed bookings are holding slots on this date.
                </div>
              ) : selectedAvailability.events.map((booking) => (
                <Card key={booking.id} size="small" className="border border-gray-200">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Text strong>{booking.title}</Text>
                      <div className="mt-1">
                        <Tag color={getStatusColor(booking.status)}>{booking.status.toUpperCase()}</Tag>
                        {booking.paymentStatus && <Tag color="green">{booking.paymentStatus.toUpperCase()}</Tag>}
                      </div>
                    </div>
                    <Text className="font-semibold">{booking.time}</Text>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <EnvironmentOutlined className="text-gray-400" />
                      {booking.fieldName}
                    </div>
                    <div className="flex items-center gap-2">
                      <UserOutlined className="text-gray-400" />
                      {booking.clientName}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .calendar-container {
          overflow-x: auto;
        }

        .admin-availability-calendar .ant-picker-calendar-date-content {
          min-height: 104px;
          overflow: visible;
        }

        .admin-availability-calendar .ant-picker-calendar-date {
          border-radius: 8px;
        }

        .admin-availability-calendar .ant-picker-cell-selected .ant-picker-calendar-date {
          background: #f1faef;
          border-color: #3A8726FF;
        }

        .admin-availability-calendar .ant-picker-calendar-date:hover {
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .admin-availability-calendar .ant-picker-calendar-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }

          .admin-availability-calendar .ant-picker-calendar-date-content {
            min-height: 70px;
          }
        }
      `}</style>
    </>
  )
}

export default BookingCalendar
