import React from 'react'

export default function ServiceCard({ service, index }: { service: { icon: React.ReactNode, title: string, description: string, buttonText: string, highlight?: boolean }, index: number }) {
  return (
    <div 
            key={index}
            className={`
              relative flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl
              ${service.highlight 
                ? 'bg-gradient-to-br from-[#3A8726FF] to-[#2C6A1BFF] text-white shadow-lg' 
                : 'bg-white border-2 border-gray-100 hover:border-[#3A8726FF] shadow-md'
              }
            `}
          >
            {service.highlight && (
              <div className='absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full'>
                Popular
              </div>
            )}
            
            <div className='text-4xl md:text-5xl mb-4'>
              {service.icon}
            </div>
            
            <h3 className={`text-lg md:text-xl font-bold mb-3 ${service.highlight ? 'text-white' : 'text-gray-800'}`}>
              {service.title}
            </h3>
            
            <p className={`text-sm md:text-base mb-6 leading-relaxed ${service.highlight ? 'text-gray-100' : 'text-gray-600'}`}>
              {service.description}
            </p>
            
            <button 
              className={`
                w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 
                ${service.highlight 
                  ? 'bg-white text-[#3A8726FF] hover:bg-gray-100 hover:scale-105' 
                  : 'bg-[#3A8726FF] text-white hover:bg-[#2C6A1BFF] hover:scale-105'
                }
              `}
            >
              {service.buttonText}
            </button>
          </div>
  )
}
