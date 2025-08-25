'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from 'antd'
import { 
  TrophyOutlined, 
  TeamOutlined, 
  StarOutlined, 
  SafetyOutlined,
  HeartOutlined,
  RocketOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons'

export default function AboutPage() {
  const stats = [
    { number: '500+', label: 'Active Players', icon: <TeamOutlined /> },
    { number: '15+', label: 'Professional Coaches', icon: <StarOutlined /> },
    { number: '50+', label: 'Tournaments Hosted', icon: <TrophyOutlined /> },
    { number: '8', label: 'Years of Excellence', icon: <HeartOutlined /> }
  ]

  const values = [
    {
      title: 'Excellence',
      description: 'We strive for the highest standards in everything we do, from our facilities to our coaching.',
      icon: <StarOutlined className="text-2xl text-[#3A8726FF]" />
    },
    {
      title: 'Community',
      description: 'Building strong relationships and fostering a sense of belonging for all our members.',
      icon: <TeamOutlined className="text-2xl text-[#3A8726FF]" />
    },
    {
      title: 'Safety',
      description: 'Ensuring a safe and secure environment for players of all ages and skill levels.',
      icon: <SafetyOutlined className="text-2xl text-[#3A8726FF]" />
    },
    {
      title: 'Innovation',
      description: 'Continuously improving our methods and facilities to provide the best experience.',
      icon: <RocketOutlined className="text-2xl text-[#3A8726FF]" />
    }
  ]

  const team = [
    {
      name: 'Samuel Kiprotich',
      role: 'Head Coach & Facility Director',
      experience: '15+ years coaching experience',
      specialization: 'Youth Development & Tactical Training',
      image: '/team/coach1.jpg' // Placeholder - you can add actual images
    },
    {
      name: 'Grace Wanjiku',
      role: 'Academy Manager',
      experience: '10+ years in sports management',
      specialization: 'Program Development & Operations',
      image: '/team/manager1.jpg'
    },
    {
      name: 'James Mwangi',
      role: 'Technical Director',
      experience: 'Former professional player',
      specialization: 'Skills Development & Performance',
      image: '/team/technical1.jpg'
    },
    {
      name: 'Faith Akinyi',
      role: 'Youth Coordinator',
      experience: '8+ years working with youth',
      specialization: 'Child Development & Welfare',
      image: '/team/youth1.jpg'
    }
  ]

  const milestones = [
    {
      year: '2016',
      title: 'Foundation',
      description: 'Arena 03 Kilifi was established with a vision to provide world-class football facilities to the coastal region.'
    },
    {
      year: '2018',
      title: 'First Championship',
      description: 'Our youth team won their first regional championship, putting us on the map as a serious training facility.'
    },
    {
      year: '2020',
      title: 'Facility Expansion',
      description: 'Added modern changing rooms, equipment storage, and spectator areas to enhance the experience.'
    },
    {
      year: '2022',
      title: 'Professional Partnerships',
      description: 'Established partnerships with professional clubs for player development and scouting opportunities.'
    },
    {
      year: '2024',
      title: 'Community Impact Award',
      description: 'Recognized by the county government for our contribution to youth development and community sports.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Arena 03 Kilifi</h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-4xl mx-auto">
              Where passion meets excellence. We're more than just a football field – we're a community 
              dedicated to nurturing talent and building champions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/booking" className="bg-white text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Book a Session
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3A8726FF] transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(stat.icon, { className: 'text-white text-2xl' })}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Arena 03 Kilifi was born from a simple dream: to create a world-class football facility 
                  that would serve the passionate football community along Kenya's beautiful coast.
                </p>
                <p>
                  Founded in 2016 by a group of former professional players and coaches, we recognized 
                  the need for a premier training facility that could nurture local talent while providing 
                  recreational opportunities for football enthusiasts of all ages.
                </p>
                <p>
                  What started as a single field has grown into a comprehensive football complex that 
                  hosts training sessions, competitive matches, tournaments, and community events. 
                  We've become a hub for football excellence in the coastal region.
                </p>
                <p>
                  Today, Arena 03 Kilifi stands as a testament to what's possible when passion meets 
                  dedication. We continue to evolve, always with our core mission in mind: developing 
                  not just better players, but better people.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-[#3A8726FF] to-[#2d6b1f] rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-green-100 mb-6">
                  To provide exceptional football facilities and training programs that inspire, 
                  develop, and unite our community through the beautiful game.
                </p>
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-green-100">
                  To be the premier football destination on the Kenyan coast, recognized for 
                  excellence in facilities, coaching, and community impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and shape the culture of our facility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced and passionate team is dedicated to providing the best football experience 
              for all our members.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#3A8726FF] to-[#2d6b1f] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-[#3A8726FF] font-semibold mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 mb-2">{member.experience}</p>
                  <p className="text-sm text-gray-500">{member.specialization}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to becoming the premier football facility on the coast.
            </p>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#3A8726FF] hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <Card className="p-6 border-0 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#3A8726FF] rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden md:block w-4 h-4 bg-[#3A8726FF] rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  <div className="w-full md:w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">World-Class Facilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our state-of-the-art facilities are designed to provide the best possible football experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <TrophyOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">FIFA Standard Pitch</h3>
                <p className="text-gray-600">
                  Our main field meets international FIFA standards with professional-grade natural grass 
                  and proper drainage systems.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <SafetyOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Modern Changing Rooms</h3>
                <p className="text-gray-600">
                  Clean, spacious changing rooms with hot showers, lockers, and all the amenities 
                  players need before and after training.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <TeamOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Spectator Areas</h3>
                <p className="text-gray-600">
                  Comfortable seating areas for families and supporters to watch training sessions 
                  and matches in comfort.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <EnvironmentOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Parking & Access</h3>
                <p className="text-gray-600">
                  Ample parking space and easy access from main roads, making it convenient 
                  for players and families to visit.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <ClockCircleOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Floodlighting</h3>
                <p className="text-gray-600">
                  Professional LED floodlights allow for evening training sessions and matches, 
                  extending playing hours throughout the day.
                </p>
              </div>
            </Card>

            <Card className="border-0 shadow-lg">
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                  <HeartOutlined className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Equipment Storage</h3>
                <p className="text-gray-600">
                  Secure storage facilities for training equipment, ensuring everything is 
                  properly maintained and readily available.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact CTA Section */}
      <div className="py-20 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Whether you're looking to improve your skills, join a team, or simply enjoy playing football 
            in a professional environment, Arena 03 Kilifi is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="bg-white text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Book Your Session
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3A8726FF] transition-colors">
              Contact Us
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-green-100">
            <div className="flex items-center justify-center gap-3">
              <EnvironmentOutlined className="text-2xl" />
              <span>Kilifi, Kenya</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <PhoneOutlined className="text-2xl" />
              <span>+254 123 456 789</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MailOutlined className="text-2xl" />
              <span>info@arena03kilifi.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
