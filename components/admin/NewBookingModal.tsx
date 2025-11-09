"use client"

import React, { useState, useEffect } from 'react'
import { Modal, Input, Select, DatePicker, TimePicker, InputNumber, Button, Form, message, AutoComplete } from 'antd'
import { UserOutlined, PhoneOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons'
import { bookingAPI, fieldAPI, userAPI } from '@/utils/api'
import { Field, UserType } from '@/types'
import dayjs from 'dayjs'

const { Option } = Select
const { TextArea } = Input

interface NewBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface CustomerOption {
  value: string
  label: string
  user: UserType
}

export default function NewBookingModal({ isOpen, onClose, onSuccess }: NewBookingModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [customerType, setCustomerType] = useState<'existing' | 'new'>('existing')
  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([])
  const [searchValue, setSearchValue] = useState('')

  // Load fields and users on mount
  useEffect(() => {
    if (isOpen) {
      loadFields()
      loadUsers()
      form.resetFields()
      setCustomerType('existing')
      setSearchValue('')
    }
  }, [isOpen, form])

  // Load available fields
  const loadFields = async () => {
    try {
      const response = await fieldAPI.getAll()
      setFields(response.data || [])
    } catch (error) {
      console.error('Error loading fields:', error)
      message.error('Failed to load fields')
    }
  }

  // Load existing users
  const loadUsers = async () => {
    try {
      const response = await userAPI.getAll()
      const usersData = response.data || []
      setUsers(usersData)
      
      // Create autocomplete options
      const options: CustomerOption[] = usersData.map((user: UserType) => ({
        value: user._id,
        label: `${user.first_name} ${user.second_name} (${user.email})`,
        user: user
      }))
      setCustomerOptions(options)
    } catch (error) {
      console.error('Error loading users:', error)
      message.error('Failed to load users')
    }
  }

  // Filter customers based on search
  const filteredOptions = customerOptions.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
    option.user.phone_number?.toLowerCase().includes(searchValue.toLowerCase())
  )

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      let clientId = values.existingCustomer

      // If creating new customer, create user first
      if (customerType === 'new') {
        const newUserData = {
          first_name: values.firstName,
          second_name: values.lastName,
          email: values.email,
          phone_number: values.phoneNumber,
          date_of_birth: dayjs().format('YYYY-MM-DD'), // Default date
          role: 'User'
        }

        // Check if we have a user creation endpoint, otherwise handle client-side
        // For now, we'll simulate creating a user and use their email as identifier
        clientId = values.email
      }

      // Prepare booking data
      const bookingData: any = {
        date_requested: dayjs(values.date).format('YYYY-MM-DD'),
        time: values.time, // Time is already in HH:mm format from the Select dropdown
        duration: parseInt(values.duration),
        field: values.field,
        teamName: values.teamName || '',
        client: clientId,
        total_price: parseFloat(values.totalPrice) || 0,
        status: values.status || 'pending',
        payment_status: 'pending'
      }

      // Add new customer fields if creating new customer
      if (customerType === 'new') {
        bookingData.firstName = values.firstName
        bookingData.lastName = values.lastName
        bookingData.phoneNumber = values.phoneNumber
      }

      await bookingAPI.createAdmin(bookingData)
      message.success('Booking created successfully!')
      form.resetFields()
      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Error creating booking:', error)
      message.error(error?.message || 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  // Calculate total price based on field and duration
  const calculatePrice = (fieldId: string, duration: number) => {
    const selectedField = fields.find(f => f._id === fieldId)
    if (selectedField && duration) {
      const totalPrice = selectedField.price_per_hour * duration
      form.setFieldsValue({ totalPrice })
    }
  }

  // Handle field or duration change
  const handlePriceCalculation = () => {
    const fieldId = form.getFieldValue('field')
    const duration = form.getFieldValue('duration')
    if (fieldId && duration) {
      calculatePrice(fieldId, duration)
    }
  }

  // Time slots for selection
  const timeSlots = []
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`)
  }

  return (
    <Modal
      title="Create New Booking"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        {/* Customer Selection */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Customer Information</h4>
          
          <div className="flex gap-4 mb-4">
            <Button
              type={customerType === 'existing' ? 'primary' : 'default'}
              onClick={() => setCustomerType('existing')}
            >
              Existing Customer
            </Button>
            <Button
              type={customerType === 'new' ? 'primary' : 'default'}
              onClick={() => setCustomerType('new')}
            >
              New Customer
            </Button>
          </div>

          {customerType === 'existing' ? (
            <Form.Item
              name="existingCustomer"
              label="Select Customer"
              rules={[{ required: true, message: 'Please select a customer' }]}
            >
              <AutoComplete
                options={filteredOptions}
                onSearch={setSearchValue}
                placeholder="Search by name, email, or phone"
                filterOption={false}
                style={{ width: '100%' }}
              />
            </Form.Item>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[{ required: true, message: 'Please enter first name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="First name" />
              </Form.Item>
              
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[{ required: true, message: 'Please enter last name' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Last name" />
              </Form.Item>
              
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="email@example.com" />
              </Form.Item>
              
              <Form.Item
                name="phoneNumber"
                label="Phone Number"
                rules={[{ required: true, message: 'Please enter phone number' }]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="+254 700 000 000" />
              </Form.Item>
            </div>
          )}
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="field"
            label="Field"
            rules={[{ required: true, message: 'Please select a field' }]}
          >
            <Select 
              placeholder="Select field"
              onChange={handlePriceCalculation}
            >
              {fields.map(field => (
                <Option key={field._id} value={field._id}>
                  {field.name} - KSh {field.price_per_hour}/hr
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Booking Date"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="time"
            label="Booking Time"
            rules={[{ required: true, message: 'Please select time' }]}
          >
            <Select placeholder="Select time">
              {timeSlots.map(time => (
                <Option key={time} value={time}>{time}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (hours)"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <InputNumber
              min={1}
              max={12}
              style={{ width: '100%' }}
              placeholder="Duration in hours"
              onChange={handlePriceCalculation}
            />
          </Form.Item>

          <Form.Item
            name="totalPrice"
            label="Total Price (KSh)"
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Auto-calculated"
              readOnly
              formatter={value => `KSh ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Booking Status"
            initialValue="pending"
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="cancelled">Cancelled</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="teamName"
          label="Team Name (Optional)"
        >
          <Input placeholder="Enter team name if applicable" />
        </Form.Item>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
          >
            Create Booking
          </Button>
        </div>
      </Form>
    </Modal>
  )
}