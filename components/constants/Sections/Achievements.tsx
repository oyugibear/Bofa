import { Badge, Card } from 'antd'
import React from 'react'
import { 
  TrophyOutlined, 
} from '@ant-design/icons'

export default function Achievements() {

      const achievements = [
        {
        year: '2024',
        title: 'Regional Youth Champions',
        category: 'U-15 Boys',
        description: 'Our Elite Academy team won the Coastal Region Youth Championship'
        },
        {
        year: '2024',
        title: 'Girls Football Excellence Award',
        category: 'Development Program',
        description: 'Recognized for outstanding contribution to girls football development'
        },
        {
        year: '2023',
        title: 'Best Academy Award',
        category: 'Kilifi County',
        description: 'County government recognition for youth development excellence'
        },
        {
        year: '2023',
        title: 'Player of the Year',
        category: 'Individual Achievement',
        description: 'Three academy graduates received county-level recognition'
        }
    ]
  
  return (
        <div className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Achievements</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Celebrating the success of our academy and the achievements of our talented players.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((achievement, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                        <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center flex-shrink-0">
                            <TrophyOutlined className="text-white text-2xl" />
                            </div>
                            <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl font-bold text-[#3A8726FF]">{achievement.year}</span>
                                <Badge count={achievement.category} style={{ backgroundColor: '#f0f0f0', color: '#666' }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.title}</h3>
                            <p className="text-gray-600">{achievement.description}</p>
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
