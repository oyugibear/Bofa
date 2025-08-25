import { Badge, Card } from 'antd'
import React from 'react'

export default function Coachs() {
    const coaches = [
        {
        name: 'Samuel Kiprotich',
        role: 'Head Coach & Technical Director',
        qualifications: ['UEFA B License', 'CAF Level 2'],
        experience: '15+ years',
        specialization: 'Youth Development & Tactical Training',
        programs: ['Elite Academy', 'Youth Development'],
        image: '/coaches/samuel.jpg'
        },
        {
        name: 'Grace Wanjiku',
        role: 'Youth Development Coach',
        qualifications: ['CAF Level 1', 'Child Protection Certified'],
        experience: '10+ years',
        specialization: 'Technical Skills & Character Building',
        programs: ['Little Kicks', 'Youth Development'],
        image: '/coaches/grace.jpg'
        },
        {
        name: 'James Mwangi',
        role: 'Elite Performance Coach',
        qualifications: ['UEFA A License', 'Sports Science Degree'],
        experience: '12+ years',
        specialization: 'Advanced Tactics & Conditioning',
        programs: ['Elite Academy', 'Adult Training'],
        image: '/coaches/james.jpg'
        },
        {
        name: 'Faith Akinyi',
        role: 'Girls Football Coordinator',
        qualifications: ['CAF Level 2', 'Women\'s Football Specialist'],
        experience: '8+ years',
        specialization: 'Female Player Development',
        programs: ['Girls Football'],
        image: '/coaches/faith.jpg'
        },
        {
        name: 'Michael Otieno',
        role: 'Goalkeeper Coach',
        qualifications: ['FIFA Goalkeeper Level 3', 'Former Professional GK'],
        experience: '20+ years',
        specialization: 'Goalkeeper Training & Mental Preparation',
        programs: ['Goalkeeper Academy'],
        image: '/coaches/michael.jpg'
        }
    ]
  return (
    <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="h2 font-bold text-gray-800 mb-4">Our Coaching Team</h2>
                <p className=" text-gray-600 max-w-3xl mx-auto">
                Experienced and qualified coaches dedicated to developing each player's potential 
                both on and off the field.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {coaches.map((coach, index) => (
                <Card key={index} className="border-0 shadow-lg">
                    <div className="p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#3A8726FF] to-[#2d6b1f] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">
                        {coach.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{coach.name}</h3>
                    <p className="text-[#3A8726FF] font-semibold mb-3">{coach.role}</p>
                    
                    <div className="text-sm text-gray-600 mb-3">
                        <div className="mb-2">
                        <strong>Experience:</strong> {coach.experience}
                        </div>
                        <div className="mb-2">
                        <strong>Specialization:</strong> {coach.specialization}
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <div className="text-sm font-semibold text-gray-700 mb-1">Qualifications:</div>
                        {coach.qualifications.map((qual, idx) => (
                        <Badge key={idx} count={qual} style={{ backgroundColor: '#3A8726', fontSize: '10px', marginRight: '4px', marginBottom: '4px' }} />
                        ))}
                    </div>
                    
                    <div>
                        <div className="text-sm font-semibold text-gray-700 mb-1">Programs:</div>
                        <div className="flex flex-wrap gap-1">
                        {coach.programs.map((program, idx) => (
                            <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {program}
                            </span>
                        ))}
                        </div>
                    </div>
                    </div>
                </Card>
                ))}
            </div>
        </div>
    </div>
  )
}
