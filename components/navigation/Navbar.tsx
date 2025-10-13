'use client'

import { Drawer, Dropdown, MenuProps } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { FaCartPlus } from 'react-icons/fa'
import { HiOutlineShoppingBag, HiOutlineUser } from 'react-icons/hi2'
import { IoMenuOutline, IoClose } from 'react-icons/io5'
import { useAuth } from '../../contexts/AuthContext'
import { useUser } from '../../hooks/useUser'
import { BiMenuAltLeft, BiMenuAltRight } from 'react-icons/bi'

const navigationItems = [
  {
    href: "/academy",
    label: "Football Academy",
    description: "Professional coaching and training programs"
  },
  {
    href: "/booking",
    label: "Book Field",
    description: "Reserve your spot on our premium field"
  },
  {
    href: "/leagues",
    label: "Leagues",
    description: "Join our competitive leagues"
  },
  {
    href: "/about",
    label: "About Us",
    description: "Learn more about Arena 03 Kilifi"
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Get in touch with our team"
  },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, token } = useAuth();
  const { user, isAuthenticated, fullName, displayName, isAdmin } = useUser();

  const showDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Enhanced debugging
  console.log("Auth Debug:", {
    user,
    isAuthenticated,
    hasToken: !!token,
    userRole: user?.role,
    isAdmin,
    fullName
  });

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Link href="/account" className='flex items-center gap-2'>
          My Account
        </Link>
      ),
    },
    ...(isAdmin ? [{
      key: '2',
      label: (
        <Link href="/admin" className='flex items-center gap-2'>
          Admin
        </Link>
      ),
    }] : []),
    {
      key: '3',
      label: (
        <p 
          onClick={() => {
            logout()
            closeDrawer()
          }} 
          className='flex items-center gap-2 cursor-pointer text-red-600'
        >
          Logout
        </p>
      ),
    },
    
  ];

  console.log("user items", user, isAuthenticated)

  return (
    <div className='flex flex-col w-full items-center justify-center bg-white text-sm'>
        <div className='flex flex-row items-center justify-between max-w-[1440px] w-full mx-auto p-4'>
            <Link href="/" className='flex-shrink-0'>
                <Image src="/logo.webp" alt="Arena 03 Kilifi Logo" width={80} height={80} className='hover:scale-105 transition-transform duration-200' />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex flex-row items-center space-x-6'>
                <Link href="/academy" className='text-gray-700 hover:text-[#3A8726FF] font-medium transition-colors duration-200'>Academy</Link>
                <Link href="/booking" className='text-gray-700 hover:text-[#3A8726FF] font-medium transition-colors duration-200'>Book Field</Link>
                <Link href="/leagues" className='text-gray-700 hover:text-[#3A8726FF] font-medium transition-colors duration-200'>Leagues</Link>
                <Link href="/about" className='text-gray-700 hover:text-[#3A8726FF] font-medium transition-colors duration-200'>About Us</Link>  
            </div>

            <div className='flex flex-row items-center gap-4'>
                { isAuthenticated && user ? (
                  <>
                    <Dropdown menu={{ items }}>
                      <div className='flex items-center gap-2 font-medium cursor-pointer'>
                        <p>More</p>
                        <BiMenuAltLeft/>
                      </div>
                    </Dropdown>
                    
                  </>
                ) : (
                    <Link href="/auth/login" className='text-gray-700 hover:text-[#3A8726FF] transition-colors duration-200'>
                        <button className='flex items-center gap-1 p-3 pointer-cursor hover:bg-[#F5FBF4FF] border border-[#3A8726FF] rounded-full font-medium transition-colors duration-200'>
                            <HiOutlineUser size={20} className="text-[#3A8726FF]"/>
                            Sign In
                        </button>
                    </Link>
                )}
                
                {/* Mobile Menu Button */}
                <div className='md:hidden'>
                    <button 
                        onClick={showDrawer}
                        className='text-gray-700 hover:text-[#3A8726FF] transition-colors duration-200 p-1'
                    >
                        <CiMenuBurger size={20} />
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Drawer */}
        <Drawer
          title={
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="Arena 03 Kilifi Logo" width={40} height={40} />
              <span className="text-lg font-bold text-[#3A8726FF]">Arena 03 Kilifi</span>
            </div>
          }
          placement="right"
          closable={true}
          onClose={closeDrawer}
          open={drawerOpen}
          width={300}
          className="mobile-drawer"
        >
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={closeDrawer}
                className="group block p-4 rounded-lg hover:bg-[#F5FBF4FF] transition-colors duration-200"
              >
                <div className="text-gray-800 group-hover:text-[#3A8726FF] font-medium text-base">
                  {item.label}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  {item.description}
                </div>
              </Link>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              {isAuthenticated && user ? (
                <>
                  <div className="text-center mb-2">
                    <p className="text-gray-700 font-medium">Welcome, {fullName}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={closeDrawer}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5FBF4FF] transition-colors duration-200"
                  >
                    <HiOutlineUser size={20} className="text-[#3A8726FF]" />
                    <span className="text-gray-700 font-medium">My Account</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeDrawer}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#3A8726FF] text-white hover:bg-[#2d6b1f] transition-colors duration-200"
                    >
                      <HiOutlineUser size={20} />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout()
                      closeDrawer()
                    }}
                    className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={closeDrawer}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5FBF4FF] transition-colors duration-200"
                >
                  <HiOutlineUser size={20} className="text-[#3A8726FF]" />
                  <span className="text-gray-700 font-medium">Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </Drawer>
    </div>
  )
}
