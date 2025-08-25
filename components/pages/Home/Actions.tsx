import ServiceCard from '@/components/constants/Cards/ServiceCard';
import React from 'react'

export default function Actions() {
  const services = [
    {
      title: "Book the Field",
      description: "Reserve your spot on our premium football field. Perfect for training sessions, matches, or casual games with friends.",
      icon: "🏟️",
      buttonText: "Book Now",
      highlight: true
    },
    {
      title: "Football Academy",
      description: "Join our professional football academy and develop your skills under expert coaching. All skill levels welcome.",
      icon: "⚽",
      buttonText: "Register Now",
      highlight: false
    },
    {
      title: "Arena 03 Kids League",
      description: "Let your kids experience the joy of football in our safe, fun, and competitive kids league. Ages 6-14 welcome.",
      icon: "👶",
      buttonText: "Join Kids League",
      highlight: false
    },
    {
      title: "Arena 03 League",
      description: "Compete in our adult league with teams from across the region. Show your skills and win exciting prizes.",
      icon: "🏆",
      buttonText: "Join League",
      highlight: false
    }
  ];

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto  min-h-[50vh] md:my-9 h-full p-4 md:p-8 space-y-8'>
      <div className='text-center space-y-4'>
        <h2 className='h2 text-2xl md:text-3xl lg:text-4xl'>What You Can Do at Arena 03</h2>
        <p className='text-sm md:text-base lg:text-lg text-gray-600 max-w-[600px]'>
          Discover all the exciting opportunities available at Arena 03 Kilifi. From casual bookings to competitive leagues, we have something for everyone.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} index={index} />
        ))}
      </div>

    </div>
  )
}
