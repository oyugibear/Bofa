import React from 'react'

export default function StatsCards({ userProfile }: { userProfile: any }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-[#3A8726FF]">{userProfile.totalBookings}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg sm:text-2xl font-bold text-[#3A8726FF]">
                <span className="sm:hidden">KSh {(userProfile.totalSpent / 1000).toFixed(0)}K</span>
                <span className="hidden sm:inline">KSh {userProfile.totalSpent.toLocaleString()}</span>
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Total Spent</div>
        </div>
        
    </div>
  )
}
