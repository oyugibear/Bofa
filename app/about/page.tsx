'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  TeamOutlined,
  TrophyOutlined,
  StarOutlined,
  SafetyOutlined,
  HeartOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'
import AboutHero from '@/components/constants/Sections/BasicHero'
import CTA from '@/components/constants/Sections/CTA'

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Active Players', icon: '⚽' },
    { number: '15+', label: 'Professional Coaches', icon: '👨‍🏫' },
    { number: '50+', label: 'Tournaments Hosted', icon: '🏆' },
    { number: '8', label: 'Years of Excellence', icon: '💪' },
  ]

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from our facilities to our coaching.',
      icon: '⭐',
    },
    {
      title: 'Community',
      description: 'Building strong relationships and fostering a sense of belonging for all our members.',
      icon: '🤝',
    },
    {
      title: 'Safety',
      description: 'Ensuring a safe and secure environment for players of all ages and skill levels.',
      icon: '🛡️',
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our methods and facilities to provide the best experience.',
      icon: '🚀',
    },
  ]

  const team = [
    {
      name: 'John Mutua',
      role: 'Head Coach',
      experience: '15 years experience',
      specialization: 'Youth Development'
    },
    {
      name: 'Sarah Wanjiku',
      role: 'Technical Director',
      experience: '12 years experience',
      specialization: 'Professional Training'
    },
    {
      name: 'David Ochieng',
      role: 'Fitness Coach',
      experience: '8 years experience',
      specialization: 'Sports Science'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Unique Hero Section */}
      <AboutHero />

      {/* Stats Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
          <div className='text-center space-y-6'>
            <h2 className='font-bold text-xl md:text-2xl text-gray-900'>Our Impact in Numbers</h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed'>
              Proudly serving the Kilifi community with world-class football facilities and programs
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'>
                <div className='text-4xl mb-6'>{stat.icon}</div>
                <h4 className='text-2xl md:text-3xl font-bold text-gray-800 mb-2'>{stat.number}</h4>
                <p className='text-base text-gray-600'>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

        {/* Our Story Section */}
      <div className="py-12 md:py-16">
        <div className='max-w-7xl w-full flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 space-y-16'>
          <div className='text-center space-y-6'>
            <h2 className='font-bold text-xl md:text-2xl text-gray-900'>Our Story & Mission</h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              From humble beginnings to becoming Kilifi's premier football destination
            </p>
          </div>

          <div className='flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full'>
            <div className='flex-1 order-2 lg:order-1 space-y-8'>
              <div className='space-y-6'>
                <h3 className='text-lg md:text-xl font-bold text-gray-800'>Our Journey</h3>
                <div className='space-y-4'>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    Arena 03 Kilifi began with a dream in 2016 — to build a world-class football facility that nurtures coastal talent and fosters community engagement.
                  </p>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    Founded by seasoned players and coaches, our goal was to create an inclusive space where players of all ages could train, compete, and grow both as athletes and individuals.
                  </p>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    Today, we've evolved into a comprehensive training hub — a symbol of passion, discipline, and community spirit that continues to shape the future of football in Kenya.
                  </p>
                </div>
              </div>
            </div>

            <div className='flex-1 order-1 lg:order-2'>
              <div className="bg-gradient-to-br from-[#3A8726FF] to-[#2C6A1BFF] text-white rounded-xl p-8 space-y-6">
                <div>
                  <h3 className='text-lg md:text-xl font-bold mb-3'>Our Mission</h3>
                  <p className='text-sm md:text-base opacity-90 leading-relaxed'>
                    To inspire and develop the next generation of footballers through world-class training, mentorship, and community programs that build character and excellence.
                  </p>
                </div>
                <div>
                  <h3 className='text-lg md:text-xl font-bold mb-3'>Our Vision</h3>
                  <p className='text-sm md:text-base opacity-90 leading-relaxed'>
                    To be Kenya's leading football destination, recognized for excellence in player development and positive community impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Core Values Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-12'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>Our Core Values</h3>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              The principles that guide everything we do at Arena 03 Kilifi
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {values.map((value, index) => (
              <div key={index} className='text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'>
                <div className='text-4xl mb-6'>{value.icon}</div>
                <h4 className='text-base md:text-lg font-semibold text-gray-800 mb-4'>{value.title}</h4>
                <p className='text-sm text-gray-600 leading-relaxed'>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-12 md:py-16">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-12'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>Meet Our Team</h3>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Experienced professionals dedicated to your football journey
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {team.map((member, index) => (
              <div key={index} className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300'>
                <div className='w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl font-bold'>👨‍🏫</span>
                </div>
                <h4 className='text-lg font-semibold text-gray-800 mb-2'>{member.name}</h4>
                <p className='text-base text-green-600 font-medium mb-2'>{member.role}</p>
                <p className='text-sm text-gray-600 mb-1'>{member.experience}</p>
                <p className='text-sm text-gray-500'>{member.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unique CTA Section - Take the Next Step */}
      <CTA />
    </div>
  )
}
