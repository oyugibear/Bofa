import Image from 'next/image'
import React from 'react'

export default function About() {
  const features = [
    {
      icon: "🏟️",
      title: "Premium Facilities",
      description: "State-of-the-art football field with professional-grade turf and lighting"
    },
    {
      icon: "👥",
      title: "Community Focused",
      description: "Building lasting relationships through sports and bringing people together"
    },
    {
      icon: "🏆",
      title: "Excellence Driven",
      description: "Committed to providing the highest quality sports and event experiences"
    },
    {
      icon: "🌟",
      title: "All Skill Levels",
      description: "From beginners to professionals, everyone is welcome at Arena 03"
    }
  ];

  return (
    <div className='max-w-[1440px] w-full flex flex-col items-center justify-center mx-auto p-4 md:p-8 min-h-[50vh] space-y-8 md:space-y-12'>
      
      {/* Header Section */}
      <div className='text-center space-y-4'>
        <h2 className='h2 text-2xl md:text-3xl lg:text-4xl text-center'>About Arena 03 Kilifi</h2>
        <p className='text-base md:text-lg text-gray-600 max-w-[600px] mx-auto'>
          Where passion meets performance in the heart of Kilifi
        </p>
      </div>

      {/* Main Content Section */}
      <div className='flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 w-full max-w-[1200px]'>
        <div className='flex-1 order-2 md:order-1 space-y-6'>
          <div className='space-y-4'>
            <h3 className='text-xl md:text-2xl font-bold text-gray-800'>Our Mission</h3>
            <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
              At Arena 03 Kilifi, we aim to be the leading sports and events venue in the region. We are about people and play as we seek to create an unparalleled experience for both athletes and event organizers.
            </p>
            <p className='text-sm md:text-base text-gray-700 leading-relaxed'>
              Our world-class facilities combined with our passion for sports create the perfect environment for athletes to thrive, teams to bond, and memories to be made.
            </p>
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-2 gap-4 mt-6'>
            <div className='text-center p-4 bg-[#F5FBF4FF] rounded-lg'>
              <div className='text-2xl md:text-3xl font-bold text-[#3A8726FF]'>500+</div>
              <div className='text-xs md:text-sm text-gray-600'>Happy Athletes</div>
            </div>
            <div className='text-center p-4 bg-[#F5FBF4FF] rounded-lg'>
              <div className='text-2xl md:text-3xl font-bold text-[#3A8726FF]'>100+</div>
              <div className='text-xs md:text-sm text-gray-600'>Events Hosted</div>
            </div>
          </div>

          <button className='bg-[#3A8726FF] hover:bg-[#2C6A1BFF] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full sm:w-auto'>
            Learn More About Us
          </button>
        </div>

        <div className='flex-1 order-1 md:order-2 w-full'>
          <div className='relative'>
            <Image
              src="/assets/pages/home/i1.webp"
              width={600}
              height={400}
              alt="About Arena 03 Kilifi"
              className='w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-xl shadow-lg'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl'></div>
            <div className='absolute bottom-4 left-4 text-white'>
              <p className='text-sm md:text-base font-semibold'>Arena 03 Kilifi</p>
              <p className='text-xs md:text-sm opacity-90'>Premium Sports Facility</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className='w-full max-w-[1200px]'>
        <h3 className='text-xl md:text-2xl font-bold text-center text-gray-800 mb-8'>What Makes Us Special</h3>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {features.map((feature, index) => (
            <div key={index} className='text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300'>
              <div className='text-3xl md:text-4xl mb-4'>{feature.icon}</div>
              <h4 className='text-lg font-semibold text-gray-800 mb-2'>{feature.title}</h4>
              <p className='text-sm text-gray-600 leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div className='bg-gradient-to-br from-[#3A8726FF] to-[#2C6A1BFF] text-white rounded-xl p-6 md:p-8 text-center w-full max-w-[800px]'>
        <h3 className='text-xl md:text-2xl font-bold mb-4'>Ready to Experience Arena 03?</h3>
        <p className='text-sm md:text-base mb-6 opacity-90'>
          Join our community of athletes and sports enthusiasts. Book your field time or register for our programs today.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <button className='bg-white text-[#3A8726FF] hover:bg-gray-100 font-bold py-3 px-6 rounded-lg transition-colors duration-200'>
            Book Field Now
          </button>
          <button className='bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#3A8726FF] font-bold py-3 px-6 rounded-lg transition-colors duration-200'>
            View Programs
          </button>
        </div>
      </div>
    </div>
  )
}
