import React from 'react'
import { 
  TrophyOutlined, 
  StarOutlined, 
  UserOutlined,
  GiftOutlined,
} from '@ant-design/icons'

export default function Stats() {
  return (
        <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                    <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserOutlined className="text-white text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">250+</div>
                    <div className="text-gray-600">Active Students</div>
                    </div>
                    <div className="text-center">
                    <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarOutlined className="text-white text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">15+</div>
                    <div className="text-gray-600">Qualified Coaches</div>
                    </div>
                    <div className="text-center">
                    <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrophyOutlined className="text-white text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">25+</div>
                    <div className="text-gray-600">Trophies Won</div>
                    </div>
                    <div className="text-center">
                    <div className="w-16 h-16 bg-[#3A8726FF] rounded-full flex items-center justify-center mx-auto mb-4">
                        <GiftOutlined className="text-white text-2xl" />
                    </div>
                    <div className="text-3xl font-bold text-gray-800 mb-2">50+</div>
                    <div className="text-gray-600">Scholarships Awarded</div>
                    </div>
                </div>
            </div>
        </div>
  )
}
