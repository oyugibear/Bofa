'use client'

import React from 'react'
import Link from 'next/link'
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  ClockCircleOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  WhatsAppOutlined,
  CalendarOutlined,
  TrophyOutlined,
  TeamOutlined,
  HeartOutlined
} from '@ant-design/icons'
import { useUser } from '../../hooks/useUser'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { isAdmin } = useUser()

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3A8726FF] rounded flex items-center justify-center">
                <TrophyOutlined className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-bold">Arena 03 Kilifi</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Premier sports facility in Kilifi offering world-class football fields, 
              training facilities, and sporting events. Your destination for excellence in sports.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#3A8726FF] transition-colors"
              >
                <FacebookOutlined />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#3A8726FF] transition-colors"
              >
                <TwitterOutlined />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#3A8726FF] transition-colors"
              >
                <InstagramOutlined />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#3A8726FF] transition-colors"
              >
                <YoutubeOutlined />
              </a>
              <a 
                href="https://wa.me/254700000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#3A8726FF] transition-colors"
              >
                <WhatsAppOutlined />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm flex items-center gap-2">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm flex items-center gap-2">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm flex items-center gap-2">
                  <CalendarOutlined className="text-xs" />
                  <span>Book a Field</span>
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link href="/admin" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm flex items-center gap-2">
                    <TeamOutlined className="text-xs" />
                    <span>Admin Panel</span>
                  </Link>
                </li>
              )}
              <li>
                <Link href="/account" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm flex items-center gap-2">
                  <span>My Account</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm">⚽ Football Field Rental</li>
              <li className="text-gray-300 text-sm">🏃‍♂️ Training Sessions</li>
              <li className="text-gray-300 text-sm">🏆 Tournament Hosting</li>
              <li className="text-gray-300 text-sm">👨‍🏫 Coaching Services</li>
              <li className="text-gray-300 text-sm">🎉 Event Hosting</li>
              <li className="text-gray-300 text-sm">🏃‍♀️ Fitness Programs</li>
              <li className="text-gray-300 text-sm">📸 Photography Services</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <EnvironmentOutlined className="text-[#3A8726FF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Arena 03 Sports Complex</p>
                  <p className="text-gray-300 text-sm">Kilifi County, Kenya</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <PhoneOutlined className="text-[#3A8726FF] flex-shrink-0" />
                <div>
                  <a href="tel:+254700000000" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm">
                    +254 700 000 000
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <MailOutlined className="text-[#3A8726FF] flex-shrink-0" />
                <div>
                  <a href="mailto:info@arena03kilifi.com" className="text-gray-300 hover:text-[#3A8726FF] transition-colors text-sm">
                    info@arena03kilifi.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ClockCircleOutlined className="text-[#3A8726FF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm font-medium">Operating Hours:</p>
                  <p className="text-gray-300 text-sm">Mon - Fri: 6:00 AM - 10:00 PM</p>
                  <p className="text-gray-300 text-sm">Sat - Sun: 6:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      {/* <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-semibold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest updates, events, and special offers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#3A8726FF] transition-colors flex-1 md:w-64"
              />
              <button className="px-6 py-2 bg-[#3A8726FF] text-white rounded-lg hover:bg-[#2d6b1f] transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <p>&copy; {currentYear} Arena 03 Kilifi. All rights reserved.</p>
              <div className="flex items-center gap-1">
                <span>Powered By</span>
                <Link href="https://revalstudios.com" target="_blank" rel="noopener noreferrer" className="text-[#3A8726FF] hover:text-[#2d6b1f] transition-colors">
                  <span>Reval Studios</span>
                </Link>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-[#3A8726FF] transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-[#3A8726FF] transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-[#3A8726FF] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
