'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  WhatsAppOutlined,
  SendOutlined,
  UserOutlined,
  MessageOutlined,
} from '@ant-design/icons'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert('Thank you for your message! We\'ll get back to you within 24 hours.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: 'general'
      })
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <PhoneOutlined className="text-2xl" />,
      title: 'Phone',
      details: ['+254 708 123 456', '+254 722 987 654'],
      description: 'Call us during business hours'
    },
    {
      icon: <MailOutlined className="text-2xl" />,
      title: 'Email',
      details: ['info@arena03kilifi.com', 'bookings@arena03kilifi.com'],
      description: 'We respond within 24 hours'
    },
    {
      icon: <EnvironmentOutlined className="text-2xl" />,
      title: 'Location',
      details: ['Arena 03 Sports Complex', 'Kilifi County, Kenya'],
      description: 'Visit us for a facility tour'
    },
    {
      icon: <ClockCircleOutlined className="text-2xl" />,
      title: 'Hours',
      details: ['Mon-Fri: 6:00 AM - 10:00 PM', 'Weekend: 7:00 AM - 9:00 PM'],
      description: 'Extended hours for events'
    }
  ]

  const socialMedia = [
    { icon: <FacebookOutlined />, name: 'Facebook', url: '#', color: 'hover:text-blue-600' },
    { icon: <InstagramOutlined />, name: 'Instagram', url: '#', color: 'hover:text-pink-600' },
    { icon: <TwitterOutlined />, name: 'Twitter', url: '#', color: 'hover:text-blue-400' },
    { icon: <WhatsAppOutlined />, name: 'WhatsApp', url: '#', color: 'hover:text-green-600' },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#3A8726FF] via-[#2C6A1BFF] to-[#1E4B0FFF] py-16 md:py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>

        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center'>
          <div className='space-y-6'>
            <div className='inline-flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-medium text-white'>
              <MessageOutlined className="mr-2" />
              Get In Touch
            </div>
            <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight'>
              Contact Arena 03 Kilifi
            </h1>
            <p className='text-base md:text-lg text-white opacity-90 leading-relaxed max-w-2xl mx-auto'>
              Ready to start your football journey? We're here to help with bookings, programs, and any questions you might have.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information Grid */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>Ways to Reach Us</h2>
            <p className='text-base text-gray-600 max-w-2xl mx-auto'>
              Choose the most convenient way to get in touch with our team
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {contactInfo.map((info, index) => (
              <div key={index} className='bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 text-center'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white'>
                  {info.icon}
                </div>
                <h3 className='text-lg font-bold text-gray-900 mb-3'>{info.title}</h3>
                <div className='space-y-1 mb-3'>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className='text-sm font-medium text-gray-800'>{detail}</p>
                  ))}
                </div>
                <p className='text-xs text-gray-600'>{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form & Map Section */}
      <div className="py-12 md:py-16">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Contact Form */}
            <div>
              <div className='mb-8'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>Send Us a Message</h2>
                <p className='text-base text-gray-600'>
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
                      Full Name *
                    </label>
                    <div className='relative'>
                      <UserOutlined className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                      Email Address *
                    </label>
                    <div className='relative'>
                      <MailOutlined className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label htmlFor="phone" className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone Number
                    </label>
                    <div className='relative'>
                      <PhoneOutlined className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="inquiryType" className='block text-sm font-medium text-gray-700 mb-2'>
                      Inquiry Type
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                    >
                      <option value="general">General Inquiry</option>
                      <option value="booking">Facility Booking</option>
                      <option value="programs">Training Programs</option>
                      <option value="membership">Membership</option>
                      <option value="events">Events & Tournaments</option>
                      <option value="partnership">Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className='block text-sm font-medium text-gray-700 mb-2'>
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors'
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className='block text-sm font-medium text-gray-700 mb-2'>
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none'
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendOutlined />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className='space-y-8'>
              {/* Map Placeholder */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Find Us</h3>
                <div className='bg-gray-200 rounded-xl h-64 flex items-center justify-center'>
                  <div className='text-center text-gray-600'>
                    <EnvironmentOutlined className="text-4xl mb-2" />
                    <p className='text-sm'>Interactive Map</p>
                    <p className='text-xs'>Arena 03 Sports Complex, Kilifi</p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className='bg-green-50 rounded-xl p-6'>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Need Immediate Assistance?</h3>
                <div className='space-y-4'>
                  <div className='flex items-center gap-3'>
                    <WhatsAppOutlined className="text-green-600 text-xl" />
                    <div>
                      <p className='font-medium text-gray-900'>WhatsApp</p>
                      <p className='text-sm text-gray-600'>+254 708 123 456</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-3'>
                    <PhoneOutlined className="text-green-600 text-xl" />
                    <div>
                      <p className='font-medium text-gray-900'>Emergency Line</p>
                      <p className='text-sm text-gray-600'>Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className='text-lg font-bold text-gray-900 mb-4'>Follow Us</h3>
                <div className='flex gap-4'>
                  {socialMedia.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      className={`w-12 h-12 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 ${social.color} transition-all duration-200`}
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>Frequently Asked Questions</h2>
            <p className='text-base text-gray-600'>
              Quick answers to common questions about Arena 03 Kilifi
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>What are your operating hours?</h3>
                <p className='text-sm text-gray-600'>We're open Monday-Friday 6:00 AM - 10:00 PM, and weekends 7:00 AM - 9:00 PM. Extended hours available for special events.</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Do you offer trial sessions?</h3>
                <p className='text-sm text-gray-600'>Yes! We offer complimentary trial sessions for new members. Contact us to schedule your free trial.</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>What age groups do you cater to?</h3>
                <p className='text-sm text-gray-600'>We welcome players of all ages, from youth programs (5+) to adult leagues and senior programs.</p>
              </div>
            </div>
            <div className='space-y-6'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>How do I book a facility?</h3>
                <p className='text-sm text-gray-600'>You can book online through our booking system, call us directly, or visit our facility in person.</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Do you provide equipment?</h3>
                <p className='text-sm text-gray-600'>Basic equipment is available, but we recommend bringing your own boots and gear for the best experience.</p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>Are there parking facilities?</h3>
                <p className='text-sm text-gray-600'>Yes, we have ample free parking space for all visitors and participants.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
