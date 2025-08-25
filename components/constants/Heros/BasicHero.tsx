import Image from 'next/image'
import React from 'react'

export default function BasicHero() {
  return (
    <div className='flex flex-col md:flex-row items-center justify-center w-full max-w-[1440px] mx-auto p-4 space-y-6 md:space-y-0 md:space-x-8'>
        <div className='bg-[#F5FBF4FF] rounded-lg flex flex-col md:flex-row items-center w-full'>
            <div className='flex flex-col items-start justify-center w-full md:max-w-[580px] p-4 md:p-6 gap-3 md:gap-2 md:flex-2 order-2 md:order-1'>
                <h1 className='h1 text-2xl md:text-4xl lg:text-5xl text-center md:text-left'>Unleash Your Potential on the Pitch!</h1>
                <p className='text-sm md:text-base text-center md:text-left'>
                    Join the premier football academy dedicated to developing talent, fostering teamwork, and building a lifelong passion for the beautiful game.
                </p>

                <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-2 w-full sm:w-auto'>
                    <button className='btn-primary w-full sm:w-auto'>
                        Book a Field Now
                    </button>
                    <button className='btn-secondary w-full sm:w-auto'>
                        Join Our Team
                    </button>
                </div>
            </div>
            <div className='flex-1 w-full md:w-auto order-1 md:order-2'>
                <Image 
                    src="/assets/pages/home/soccer.jpg" 
                    width={300} 
                    height={500} 
                    alt="Hero Image" 
                    className='w-full h-48 sm:h-64 md:h-full object-cover rounded-t-lg md:rounded-t-none md:rounded-r-lg' 
                />
            </div>
        </div>
    </div>
  )
}
