"use client"

import { Badge, Card } from 'antd'
import React, { useState } from 'react'
import { 
  TeamOutlined, 
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons'

export default function Programs({setSelectedProgram, setModalVisible}: {setSelectedProgram: (program: any) => void, setModalVisible: (visible: boolean) => void}) {


    const programs = [
        {
        id: 1,
        title: 'Little Kicks',
        ageGroup: '4-6 years',
        duration: '45 minutes',
        maxPlayers: '8-10',
        price: 'KSh 2,000/month',
        level: 'Beginner',
        description: 'Fun introduction to football for our youngest players',
        objectives: [
            'Basic ball control and coordination',
            'Following simple instructions',
            'Social interaction and teamwork',
            'Fun and enjoyment of the game'
        ],
        schedule: 'Saturdays 8:00 AM - 8:45 AM',
        features: [
            'Small-sided games',
            'Fun activities and games',
            'Parent involvement encouraged',
            'Safe and supportive environment'
        ],
        color: '#FF6B6B'
        },
        {
        id: 2,
        title: 'Youth Development',
        ageGroup: '7-12 years',
        duration: '60 minutes',
        maxPlayers: '12-15',
        price: 'KSh 3,500/month',
        level: 'Beginner to Intermediate',
        description: 'Comprehensive skill development program for young players',
        objectives: [
            'Technical skill development',
            'Tactical understanding',
            'Physical development',
            'Character building'
        ],
        schedule: 'Tuesdays & Thursdays 4:00 PM - 5:00 PM',
        features: [
            'Structured training sessions',
            'Inter-academy matches',
            'Skills assessment reports',
            'Holiday training camps'
        ],
        color: '#4ECDC4'
        },
        {
        id: 3,
        title: 'Elite Academy',
        ageGroup: '13-17 years',
        duration: '90 minutes',
        maxPlayers: '18-20',
        price: 'KSh 5,000/month',
        level: 'Intermediate to Advanced',
        description: 'High-performance training for serious young athletes',
        objectives: [
            'Advanced technical skills',
            'Tactical sophistication',
            'Mental toughness',
            'Leadership development'
        ],
        schedule: 'Mondays, Wednesdays & Fridays 5:00 PM - 6:30 PM',
        features: [
            'Professional coaching',
            'Video analysis',
            'Fitness and conditioning',
            'Scholarship opportunities'
        ],
        color: '#3A8726'
        },
        {
        id: 4,
        title: 'Adult Training',
        ageGroup: '18+ years',
        duration: '75 minutes',
        maxPlayers: '16-20',
        price: 'KSh 4,000/month',
        level: 'All Levels',
        description: 'Competitive training sessions for adult players',
        objectives: [
            'Fitness and conditioning',
            'Skill refinement',
            'Tactical awareness',
            'Competitive play'
        ],
        schedule: 'Saturdays 6:00 PM - 7:15 PM',
        features: [
            'League participation',
            'Friendly matches',
            'Skills workshops',
            'Social events'
        ],
        color: '#9B59B6'
        },
        {
        id: 5,
        title: 'Girls Football',
        ageGroup: '8-16 years',
        duration: '60 minutes',
        maxPlayers: '12-16',
        price: 'KSh 3,000/month',
        level: 'All Levels',
        description: 'Dedicated program for developing female football talent',
        objectives: [
            'Technical skill development',
            'Confidence building',
            'Team bonding',
            'Competition preparation'
        ],
        schedule: 'Wednesdays & Saturdays 3:00 PM - 4:00 PM',
        features: [
            'Female coaching staff',
            'Girls-only environment',
            'Mentorship programs',
            'Tournament participation'
        ],
        color: '#E74C3C'
        },
        {
        id: 6,
        title: 'Goalkeeper Academy',
        ageGroup: '10+ years',
        duration: '60 minutes',
        maxPlayers: '6-8',
        price: 'KSh 4,500/month',
        level: 'All Levels',
        description: 'Specialized training for goalkeepers of all ages',
        objectives: [
            'Shot stopping techniques',
            'Distribution skills',
            'Positioning and angles',
            'Mental preparation'
        ],
        schedule: 'Sundays 10:00 AM - 11:00 AM',
        features: [
            'Specialist goalkeeper coach',
            'Professional equipment',
            'Video analysis',
            'Individual attention'
        ],
        color: '#F39C12'
        }
    ]


    const handleProgramClick = (program: any) => {
        setSelectedProgram(program)
        setModalVisible(true)
    }
  return (
            <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="h2 font-bold text-gray-800 mb-4">Our Programs</h2>
                <p className=" text-gray-600 max-w-3xl mx-auto">
                Comprehensive training programs designed for every age group and skill level, 
                from beginner to elite performance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program) => (
                <Card 
                    key={program.id}
                    className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleProgramClick(program)}
                >
                    <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <Badge count={program.level} style={{ backgroundColor: program.color }} />
                        <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: program.color }}>
                            {program.price}
                        </div>
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                        <UserOutlined className="text-gray-500" />
                        <span className="text-sm text-gray-600">Age: {program.ageGroup}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <ClockCircleOutlined className="text-gray-500" />
                        <span className="text-sm text-gray-600">Duration: {program.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <TeamOutlined className="text-gray-500" />
                        <span className="text-sm text-gray-600">Max Players: {program.maxPlayers}</span>
                        </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-4">
                        <strong>Schedule:</strong> {program.schedule}
                    </div>
                    
                    <button 
                        className="w-full py-2 px-4 rounded-lg font-semibold transition-colors"
                        style={{ 
                        backgroundColor: program.color, 
                        color: 'white' 
                        }}
                    >
                        Learn More
                    </button>
                    </div>
                </Card>
                ))}
            </div>
            </div>
        </div>
  )
}
