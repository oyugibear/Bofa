import Link from 'next/link'
import React from 'react'
import { 
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'

export default function CTA() {
  return (
      <div className="relative py-16 md:py-24 bg-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 via-white to-yellow-50"></div>
          <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full opacity-30 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-100 rounded-full opacity-40 blur-3xl"></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
              Take Your Next Step Forward
            </h2>
            <p className='text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed'>
              Your football journey starts here. Choose how you want to begin your Arena 03 experience.
            </p>
          </div>

          {/* Interactive CTA Options */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
            {/* Option 1: Book a Trial */}
            <div className='group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-200'>
              <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <span className='text-green-500 text-2xl'>→</span>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-white text-3xl'>⚽</span>
                </div>
                <h3 className='text-lg font-bold text-gray-900'>Book a Trial Session</h3>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  Experience our facilities and coaching firsthand with a complimentary trial session.
                </p>
                <div className='pt-4'>
                  <Link href="/booking">
                    <button className='w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'>
                      Book Free Trial
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Option 2: Join a Program */}
            <div className='group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-yellow-200'>
              <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <span className='text-yellow-500 text-2xl'>→</span>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-white text-3xl'>🏆</span>
                </div>
                <h3 className='text-lg font-bold text-gray-900'>Join Our Programs</h3>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  Discover our leagues, training programs, and competitive opportunities for all skill levels.
                </p>
                <div className='pt-4'>
                  <Link href="/leagues">
                    <button className='w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'>
                      Explore Programs
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Option 3: Get in Touch */}
            <div className='group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-200'>
              <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                <span className='text-blue-500 text-2xl'>→</span>
              </div>
              <div className='text-center space-y-4'>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto'>
                  <span className='text-white text-3xl'>💬</span>
                </div>
                <h3 className='text-lg font-bold text-gray-900'>Schedule a Tour</h3>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  Visit our facilities and meet our team to learn more about what Arena 03 offers.
                </p>
                <div className='pt-4'>
                  <Link href="/contact">
                    <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'>
                      Schedule Tour
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Bar */}
          <div className='bg-gray-900 rounded-2xl p-6 md:p-8'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
              <div className='text-center md:text-left'>
                <h3 className='text-lg font-bold text-white mb-2'>Ready to Get Started?</h3>
                <p className='text-gray-300 text-sm'>Contact us directly for personalized assistance</p>
              </div>
              <div className='flex flex-col sm:flex-row gap-4'>
                <a href="tel:+254700000000" className='flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200'>
                  <PhoneOutlined />
                  <span className='font-semibold text-sm'>Call Now</span>
                </a>
                <a href="mailto:info@arena03kilifi.com" className='flex items-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-3 rounded-lg transition-colors duration-200'>
                  <MailOutlined />
                  <span className='font-semibold text-sm'>Email Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
