'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, Tabs, Badge, Modal } from 'antd'
import { 
  TrophyOutlined, 
  TeamOutlined, 
  StarOutlined, 
  ClockCircleOutlined,
  UserOutlined,
  GiftOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import CTA from '@/components/constants/Sections/CTA'
import Testimonials from '@/components/constants/Sections/Testimonials'
import Achievements from '@/components/constants/Sections/Achievements'
import Facilities from '@/components/constants/Sections/Facilities'
import Coachs from '@/components/constants/Sections/Coachs'
import Programs from '@/components/constants/Sections/Programs'
import Stats from '@/components/constants/Sections/Stats'

const { TabPane } = Tabs

export default function AcademyPage() {
    const [selectedProgram, setSelectedProgram] = useState<any>(null)
    const [modalVisible, setModalVisible] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f] text-white py-20">
            <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="h1 font-bold mb-6">Arena 03 Academy</h1>
                        <p className=" text-green-100 mb-8 max-w-4xl mx-auto">
                        Developing tomorrow's football stars through professional coaching, 
                        world-class facilities, and a passion for excellence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/booking" className="bg-white text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Join Our Academy
                        </Link>
                        <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3A8726FF] transition-colors">
                            Schedule a Trial
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Academy Stats */}
        <Stats />

        {/* Programs Section */}
        <Programs setSelectedProgram={setSelectedProgram} setModalVisible={setModalVisible} />

        {/* Coaching Staff */}
        <Coachs />

        {/* Facilities */}
        <Facilities />

        {/* Achievements */}
        <Achievements />
    
        {/* Testimonials */}
        <Testimonials />

        {/* CTA Section */}
        <CTA />

        {/* Program Details Modal */}
        <Modal
            title={selectedProgram?.title}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={[
            <Link key="register" href="/booking">
                <button 
                className="px-6 py-2 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: selectedProgram?.color }}
                >
                Register for {selectedProgram?.title}
                </button>
            </Link>
            ]}
            width={700}
        >
            {selectedProgram && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <strong>Age Group:</strong> {selectedProgram.ageGroup}
                </div>
                <div>
                    <strong>Duration:</strong> {selectedProgram.duration}
                </div>
                <div>
                    <strong>Max Players:</strong> {selectedProgram.maxPlayers}
                </div>
                <div>
                    <strong>Price:</strong> {selectedProgram.price}
                </div>
                </div>
                
                <div>
                <strong>Schedule:</strong> {selectedProgram.schedule}
                </div>
                
                <div>
                <h4 className="font-bold mb-2">Program Objectives:</h4>
                <ul className="space-y-1">
                    {selectedProgram.objectives?.map((objective: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                        <CheckCircleOutlined className="text-green-500" />
                        {objective}
                    </li>
                    ))}
                </ul>
                </div>
                
                <div>
                <h4 className="font-bold mb-2">Program Features:</h4>
                <ul className="space-y-1">
                    {selectedProgram.features?.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                        <StarOutlined className="text-yellow-500" />
                        {feature}
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            )}
        </Modal>
    </div>
  )
}
