import Link from 'next/link'
import React from 'react'
import { 
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'

export default function CTA() {
  return (
        <div className="py-20 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Football Journey?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
                Join Arena 03 Academy and be part of a community that's passionate about developing 
                both exceptional players and outstanding individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/booking" className="bg-white text-[#3A8726FF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Register Now
                </Link>
                <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#3A8726FF] transition-colors">
                Book a Trial Session
                </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-green-100">
                <div className="flex items-center justify-center gap-3">
                <EnvironmentOutlined className="text-2xl" />
                <span>Arena 03 Kilifi, Kenya</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                <PhoneOutlined className="text-2xl" />
                <span>+254 123 456 789</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                <MailOutlined className="text-2xl" />
                <span>academy@arena03kilifi.com</span>
                </div>
            </div>
            </div>
        </div>
  )
}
