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

export default function AcademyPage() {
  const stats = [
    { number: '200+', label: 'Academy Players', icon: '⚽' },
    { number: '12+', label: 'Certified Coaches', icon: '👨‍🏫' },
    { number: '25+', label: 'Trophies Won', icon: '🏆' },
    { number: '5', label: 'Age Groups', icon: '🎯' },
  ]

  const programs = [
    {
      title: 'Youth Development',
      description: 'Comprehensive training programs for ages 6-18, focusing on skill development and character building.',
      icon: '🌱',
    },
    {
      title: 'Elite Training',
      description: 'Advanced coaching for talented players seeking to reach the next level in their football journey.',
      icon: '⭐',
    },
    {
      title: 'Goalkeeper Academy',
      description: 'Specialized training for goalkeepers with professional techniques and positioning.',
      icon: '🥅',
    },
    {
      title: 'Physical Conditioning',
      description: 'Scientific approach to fitness, strength, and injury prevention for optimal performance.',
      icon: '💪',
    },
  ]

  const coaches = [
    {
      name: 'Coach Michael Otieno',
      role: 'Head Academy Coach',
      experience: '18 years experience',
      specialization: 'Youth Development & Tactics'
    },
    {
      name: 'Coach Grace Nyambura',
      role: 'Skills Development Coach',
      experience: '10 years experience',
      specialization: 'Technical Skills & Ball Control'
    },
    {
      name: 'Coach James Kimani',
      role: 'Goalkeeper Coach',
      experience: '12 years experience',
      specialization: 'Goalkeeper Training'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Unique Hero Section */}
      {/* <AboutHero /> */}

      {/* Stats Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12'>
          <div className='text-center space-y-6'>
            <h2 className='font-bold text-xl md:text-2xl text-gray-900'>Academy Excellence in Numbers</h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed'>
              Developing young talent through structured programs and professional coaching
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

      {/* Academy Story Section */}
      <div className="py-12 md:py-16">
        <div className='max-w-7xl w-full flex flex-col items-center justify-center mx-auto px-4 sm:px-6 lg:px-8 space-y-16'>
          <div className='text-center space-y-6'>
            <h2 className='font-bold text-xl md:text-2xl text-gray-900'>Academy Philosophy & Goals</h2>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Building tomorrow's football stars through discipline, dedication, and professional development
            </p>
          </div>

          <div className='flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 w-full'>
            <div className='flex-1 order-2 lg:order-1 space-y-8'>
              <div className='space-y-6'>
                <h3 className='text-lg md:text-xl font-bold text-gray-800'>Our Academy Journey</h3>
                <div className='space-y-4'>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    Arena 03 Academy was established to nurture young football talent in Kilifi and beyond. We believe every child deserves the opportunity to develop their skills in a professional environment.
                  </p>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    Our academy focuses on holistic player development - combining technical skills, tactical awareness, physical conditioning, and mental strength to create well-rounded footballers.
                  </p>
                  <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
                    With structured age-group programs and pathways to professional football, we're committed to helping young players achieve their dreams while building character and discipline.
                  </p>
                </div>
              </div>
            </div>

            <div className='flex-1 order-1 lg:order-2'>
              <div className="bg-gradient-to-br from-[#3A8726FF] to-[#2C6A1BFF] text-white rounded-xl p-8 space-y-6">
                <div>
                  <h3 className='text-lg md:text-xl font-bold mb-3'>Our Mission</h3>
                  <p className='text-sm md:text-base opacity-90 leading-relaxed'>
                    To provide world-class football education and development opportunities for young players, helping them reach their full potential both on and off the field.
                  </p>
                </div>
                <div>
                  <h3 className='text-lg md:text-xl font-bold mb-3'>Our Vision</h3>
                  <p className='text-sm md:text-base opacity-90 leading-relaxed'>
                    To be recognized as Kenya's premier youth football academy, producing talented players who excel at national and international levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Training Programs Section */}
      <div className="py-12 md:py-16 bg-gray-50">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-12'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>Our Training Programs</h3>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Comprehensive development programs tailored to different age groups and skill levels
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {programs.map((program, index) => (
              <div key={index} className='text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105'>
                <div className='text-4xl mb-6'>{program.icon}</div>
                <h4 className='text-base md:text-lg font-semibold text-gray-800 mb-4'>{program.title}</h4>
                <p className='text-sm text-gray-600 leading-relaxed'>{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coaching Team Section */}
      <div className="py-12 md:py-16">
        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center space-y-6 mb-12'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>Meet Our Coaching Team</h3>
            <p className='text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              Professional coaches dedicated to developing young talent and building character
            </p>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {coaches.map((coach, index) => (
              <div key={index} className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300'>
                <div className='w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-white text-2xl font-bold'>⚽</span>
                </div>
                <h4 className='text-lg font-semibold text-gray-800 mb-2'>{coach.name}</h4>
                <p className='text-base text-green-600 font-medium mb-2'>{coach.role}</p>
                <p className='text-sm text-gray-600 mb-1'>{coach.experience}</p>
                <p className='text-sm text-gray-500'>{coach.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <CTA />
    </div>
  )
}
