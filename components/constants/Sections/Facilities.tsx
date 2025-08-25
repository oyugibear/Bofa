import { Card } from 'antd'
import React from 'react'
import { 
  TrophyOutlined, 
  TeamOutlined, 
  SafetyOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  AimOutlined
} from '@ant-design/icons'

export default function Facilities() {
    const facilities = [
        {
        title: 'FIFA Standard Pitch',
        description: 'Professional-grade natural grass field meeting international standards',
        icon: <TrophyOutlined />
        },
        {
        title: 'Modern Changing Rooms',
        description: 'Clean facilities with hot showers and secure lockers',
        icon: <SafetyOutlined />
        },
        {
        title: 'Training Equipment',
        description: 'Complete range of professional training equipment and gear',
        icon: <AimOutlined />
        },
        {
        title: 'Video Analysis Suite',
        description: 'Technology-enhanced learning with match and training analysis',
        icon: <PlayCircleOutlined />
        },
        {
        title: 'Medical Support',
        description: 'First aid facilities and injury prevention programs',
        icon: <HeartOutlined />
        },
        {
        title: 'Parent Areas',
        description: 'Comfortable viewing areas for families and supporters',
        icon: <TeamOutlined />
        }
    ]
  return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">World-Class Facilities</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Professional-grade facilities designed to provide the best possible training environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {facilities.map((facility, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                        <div className="p-6">
                        <div className="w-12 h-12 bg-[#3A8726FF] rounded-lg flex items-center justify-center mb-4">
                            {React.cloneElement(facility.icon, { className: 'text-white text-xl' })}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">{facility.title}</h3>
                        <p className="text-gray-600">{facility.description}</p>
                        </div>
                    </Card>
                    ))}
                </div>
            </div>
        </div>
  )
}
