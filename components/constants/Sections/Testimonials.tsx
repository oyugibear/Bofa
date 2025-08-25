import { Badge, Card } from 'antd'
import React from 'react'

export default function Testimonials() {
    const testimonials = [
        {
        name: 'Mary Wanjiru',
        role: 'Parent',
        message: 'My daughter has grown so much in confidence since joining the Girls Football program. The coaches are amazing!',
        program: 'Girls Football'
        },
        {
        name: 'John Karanja',
        role: 'Former Student',
        message: 'The Elite Academy prepared me perfectly for professional football. Now playing for a Division One club!',
        program: 'Elite Academy'
        },
        {
        name: 'Sarah Muthoni',
        role: 'Parent',
        message: 'Little Kicks was the perfect introduction to football for my 5-year-old. He loves every session!',
        program: 'Little Kicks'
        }
    ]

  return (
    <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our academy families and see why Arena 03 is the top choice for football development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <div className="p-6">
                  <div className="mb-4">
                    
                    <p className="text-gray-600 italic">"{testimonial.message}"</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <Badge count={testimonial.program} style={{ backgroundColor: '#3A8726', marginTop: '8px' }} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
    </div>
  )
}
