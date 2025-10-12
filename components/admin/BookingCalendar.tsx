'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Badge, Card, Typography, Modal, Tooltip, Tag } from 'antd'
import type { CalendarProps } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { BookingDetails } from '@/types'
import { ClockCircleOutlined, UserOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

interface BookingCalendarProps {
  bookings: BookingDetails[]
}

interface BookingEvent {
  id: string
  title: string
  time: string
  clientName: string
  bookedBy?: string
  status: string
  service: string
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ bookings }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedBookings, setSelectedBookings] = useState<BookingEvent[]>([])

  // Debug: Check if we're receiving bookings
  console.log('BookingCalendar component received bookings:', bookings)

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const grouped: { [key: string]: BookingEvent[] } = {}
    
    console.log('Processing bookings for calendar:', bookings.length, bookings)
    
    // Add a test booking for today to see if rendering works
    const testBooking = {
      _id: 'test-booking',
      date_requested: dayjs().format('YYYY-MM-DD'),
      time: '10:00',
      team_name: 'Test Booking',
      client: { first_name: 'Test', second_name: 'User', email: 'test@test.com' },
      status: 'confirmed',
      field: { name: 'Test Field' }
    }
    
    // Add test booking to the array temporarily
    const allBookings = bookings.length === 0 ? [testBooking] : bookings
    console.log('Using bookings (with test if empty):', allBookings)
    
    allBookings.forEach(booking => {
      console.log('Processing booking:', booking)
      const bookingDate = dayjs(booking.date_requested).format('YYYY-MM-DD')
      console.log('Booking date formatted:', bookingDate)
      const bookingEvent: BookingEvent = {
        id: booking._id,
        title: booking.team_name || 'Field Booking',
        time: booking.time || 'No time specified',
        clientName: booking.client?.first_name && booking.client?.second_name 
          ? `${booking.client.first_name} ${booking.client.second_name}`
          : booking.client?.email || 'Unknown Client',
        bookedBy: (booking as any).postedBy?.first_name && (booking as any).postedBy?.second_name
          ? `${(booking as any).postedBy.first_name} ${(booking as any).postedBy.second_name}`
          : 'System',
        status: booking.status || 'pending',
        service: booking.team_name || booking.field?.name || 'Field Booking'
      }
      
      if (!grouped[bookingDate]) {
        grouped[bookingDate] = []
      }
      grouped[bookingDate].push(bookingEvent)
    })
    
    // Sort bookings by time for each date
    Object.keys(grouped).forEach(date => {
      grouped[date].sort((a, b) => {
        const timeA = dayjs(`2000-01-01 ${a.time}`, 'YYYY-MM-DD HH:mm')
        const timeB = dayjs(`2000-01-01 ${b.time}`, 'YYYY-MM-DD HH:mm')
        return timeA.isBefore(timeB) ? -1 : 1
      })
    })
    
    console.log('Final grouped bookings:', grouped)
    return grouped
  }, [bookings])

  // Get list data for calendar cell
  const getListData = (value: Dayjs) => {
    const dateStr = value.format('YYYY-MM-DD')
    return bookingsByDate[dateStr] || []
  }

  // Render calendar cell content for dates
  const cellRender = (value: Dayjs) => {
    const listData = getListData(value)
    
    // Debug logging
    if (listData.length > 0) {
      console.log(`Date ${value.format('YYYY-MM-DD')} has ${listData.length} bookings:`, listData)
    }
    
    if (listData.length === 0) {
      // Show a small indicator if it's today to test if the render function is working
      if (value.isSame(dayjs(), 'day')) {
        return <div style={{ fontSize: '10px', color: 'blue' }}>Today</div>
      }
      return null
    }

    return (
      <div className="calendar-events p-1">
        {listData.map((booking, index) => (
          <Tooltip 
            key={booking.id} 
            title={
              <div className="booking-tooltip">
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{booking.title}</div>
                <div><ClockCircleOutlined /> {booking.time}</div>
                <div><UserOutlined /> {booking.clientName}</div>
                <div><EnvironmentOutlined /> {booking.bookedBy}</div>
                <div>Status: <Tag color={getStatusColor(booking.status)} style={{fontSize: '10px'}}>{booking.status.toUpperCase()}</Tag></div>
              </div>
            }
            placement="topLeft"
          >
            <Tag 
              color={getStatusColor(booking.status)} 
              className="mb-1 text-xs cursor-pointer calendar-booking-tag"
              style={{ 
                fontSize: '10px', 
                padding: '1px 4px',
                margin: '1px',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
              onClick={(e) => {
                e.stopPropagation()
                setSelectedDate(value)
                setSelectedBookings(listData)
                setIsModalVisible(true)
              }}
            >
              {booking.time} {booking.title}
            </Tag>
          </Tooltip>
        ))}
      </div>
    )
  }

  // Get badge status color based on booking status
  const getStatusBadge = (status: string): 'success' | 'processing' | 'error' | 'warning' | 'default' => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'success'
      case 'pending':
        return 'processing'
      case 'cancelled':
        return 'error'
      case 'completed':
        return 'success'
      default:
        return 'default'
    }
  }

  // Get tag color based on booking status
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
      default:
        return 'default'
    }
  }

  // Handle date selection
  const onSelect = (value: Dayjs) => {
    setSelectedDate(value)
    const dayBookings = getListData(value)
    if (dayBookings.length > 0) {
      setSelectedBookings(dayBookings)
      setIsModalVisible(true)
    }
  }

  // Handle date change (when navigating months)
  const onChange: CalendarProps<Dayjs>['onChange'] = (date) => {
    setSelectedDate(date)
  }

  return (
    <>
      <Card className="mb-6 shadow-sm">
        <div className="mb-4">
          <Title level={4} className="mb-2">Booking Calendar</Title>
          <Text type="secondary" className="mb-3 block">
            View all bookings at a glance. Hover over booking tags for details or click to view all bookings for that date.
          </Text>
          
          {/* Status Legend */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Text type="secondary" className="mr-2">Status Legend:</Text>
            <Tag color="green">CONFIRMED</Tag>
            <Tag color="orange">PENDING</Tag>
            <Tag color="red">CANCELLED</Tag>
            <Tag color="blue">COMPLETED</Tag>
          </div>
        </div>
        
        <div className="calendar-container">
          <Calendar
            value={selectedDate}
            onChange={onChange}
            onSelect={onSelect}
            dateCellRender={cellRender}
            className="booking-calendar"
          />
        </div>
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title={
          <div>
            <ClockCircleOutlined className="mr-2" />
            Bookings for {selectedDate.format('MMMM D, YYYY')}
          </div>
        }
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {selectedBookings.map((booking) => (
            <Card key={booking.id} size="small" className="border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <Text strong className="text-lg">
                    {booking.title}
                  </Text>
                  <div className="mt-1">
                    <Tag color={getStatusColor(booking.status)}>
                      {booking.status.toUpperCase()}
                    </Tag>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-gray-600 mb-1">
                    <ClockCircleOutlined className="mr-1" />
                    <Text>{booking.time}</Text>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <UserOutlined className="mr-2 text-gray-400" />
                  <Text>Client: {booking.clientName}</Text>
                </div>
                
                <div className="flex items-center">
                  <EnvironmentOutlined className="mr-2 text-gray-400" />
                  <Text>Booked by: {booking.bookedBy}</Text>
                </div>
              </div>
            </Card>
          ))}
          
          {selectedBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bookings found for this date
            </div>
          )}
        </div>
      </Modal>

      <style jsx global>{`
        .calendar-container {
          overflow-x: auto;
        }
        
        .booking-calendar .ant-picker-calendar-date-content {
          height: auto;
          min-height: 80px;
          overflow: visible;
        }
        
        .calendar-events {
          padding: 2px;
          max-height: 100px;
          overflow-y: auto;
        }
        
        .calendar-booking-tag {
          font-size: 10px !important;
          line-height: 1.2 !important;
          border-radius: 2px !important;
          margin-bottom: 2px !important;
        }
        
        .booking-tooltip div {
          margin-bottom: 2px;
          font-size: 12px;
        }
        
        .booking-tooltip .anticon {
          margin-right: 4px;
        }
        
        .booking-calendar .ant-picker-cell-selected .ant-picker-calendar-date {
          background: #f0f9ff;
          border-color: #3A8726FF;
        }
        
        .booking-calendar .ant-picker-calendar-date:hover {
          background: #f9fafb;
        }
        
        .booking-calendar .ant-picker-calendar-mode-switch {
          display: flex;
          flex-wrap: wrap;
        }
        
        @media (max-width: 768px) {
          .booking-calendar .ant-picker-calendar-header {
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }
          
          .booking-calendar .ant-picker-calendar-date-content {
            min-height: 60px;
          }
          
          .calendar-booking-tag {
            font-size: 8px !important;
            padding: 0px 2px !important;
            margin-bottom: 1px !important;
          }
          
          .calendar-events {
            padding: 1px;
            max-height: 60px;
          }
        }
      `}</style>
    </>
  )
}

export default BookingCalendar
