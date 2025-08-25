'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  DollarOutlined,
  SettingOutlined,
  MenuOutlined,
  CloseOutlined
} from '@ant-design/icons'

interface SideMenuProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void
}

const SideMenu: React.FC<SideMenuProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const pathname = usePathname()
  
  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', href: '/admin' },
    { key: 'bookings', icon: <CalendarOutlined />, label: 'Bookings', href: '/admin/bookings' },
    { key: 'users', icon: <UserOutlined />, label: 'Users', href: '/admin/users' },
    { key: 'teams', icon: <TeamOutlined />, label: 'Teams', href: '/admin/teams' },
    { key: 'leagues', icon: <TrophyOutlined />, label: 'Leagues', href: '/admin/leagues' },
    { key: 'payments', icon: <DollarOutlined />, label: 'Payments', href: '/admin/payments' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', href: '/admin/settings' },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#3A8726FF] text-white p-2 rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 md:z-auto
        w-64 md:w-64 h-full md:h-auto
        bg-white shadow-xl border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#3A8726FF] to-[#2d6b1f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <TrophyOutlined className="text-xl text-[#3A8726FF]" />
            </div>
            <div>
              <div className="font-bold text-lg text-white">Arena 03</div>
              <div className="text-xs text-green-100">Admin Dashboard</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.href)
                      ? 'bg-[#3A8726FF] text-white' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default SideMenu
