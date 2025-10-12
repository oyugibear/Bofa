import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function BasicHero() {
  return (
      <div className="relative bg-gradient-to-br from-[#3A8726FF] via-[#2C6A1BFF] to-[#1E4B0FFF] py-16 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
        </div>

        <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            {/* Content Column */}
            <div className='text-white space-y-8'>
              <div className='space-y-4'>
                <div className='inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium  text-black'>
                  <span className='mr-2'>⚽</span>
                  Since 2016
                </div>
                <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold leading-tight'>
                  Where Champions Are
                  <span className='block text-yellow-300'>Born & Raised</span>
                </h1>
                <p className='text-base md:text-lg text-white opacity-90 leading-relaxed max-w-lg'>
                  From grassroots development to professional excellence, Arena 03 Kilifi has been shaping Kenya's football future for nearly a decade.
                </p>
              </div>

              {/* Key Features */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center'>
                    <span className='text-green-800 font-bold text-lg'>🏆</span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-white text-sm'>Professional Training</h3>
                    <p className='text-white opacity-75 text-xs'>World-class coaching</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center'>
                    <span className='text-green-800 font-bold text-lg'>🤝</span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-white text-sm'>Community Focus</h3>
                    <p className='text-white opacity-75 text-xs'>Inclusive programs</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center'>
                    <span className='text-green-800 font-bold text-lg'>⭐</span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-white text-sm'>Excellence Standards</h3>
                    <p className='text-white opacity-75 text-xs'>Premium facilities</p>
                  </div>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center'>
                    <span className='text-green-800 font-bold text-lg'>🌟</span>
                  </div>
                  <div>
                    <h3 className='font-semibold text-white text-sm'>Youth Development</h3>
                    <p className='text-white opacity-75 text-xs'>Future champions</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                <Link href="/leagues">
                  <button className='bg-yellow-400 hover:bg-yellow-300 text-green-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm w-full sm:w-auto'>
                    Explore Programs
                  </button>
                </Link>
                <Link href="/booking">
                  <button className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200 text-sm w-full sm:w-auto'>
                    Book a Visit
                  </button>
                </Link>
              </div>
            </div>

            {/* Image Column */}
            <div className='relative'>
              <div className='relative bg-white rounded-2xl p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500'>
                <Image 
                  src="/assets/pages/home/soccer.jpg" 
                  width={600} 
                  height={400} 
                  alt="Arena 03 Kilifi Football Training" 
                  className='w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl' 
                />
                <div className='absolute -bottom-4 -right-4 bg-yellow-400 text-green-800 font-bold px-4 py-2 rounded-lg shadow-lg'>
                  <span className='text-sm'>Est. 2016</span>
                </div>
              </div>
              
              {/* Floating Achievement Cards */}
              <div className='hidden lg:block absolute -top-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-32'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>500+</div>
                  <div className='text-xs text-gray-600'>Players Trained</div>
                </div>
              </div>
              
              <div className='hidden lg:block absolute -bottom-6 -left-8 bg-white rounded-lg shadow-lg p-4 max-w-36'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-600'>50+</div>
                  <div className='text-xs text-gray-600'>Tournaments Won</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
