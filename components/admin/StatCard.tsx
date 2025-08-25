import React from 'react'

export default function StatCard({stat, index}: {stat: {title: string, value: string | number, icon: React.ReactNode, color: string, subtitle?: string, change: string}, index: number}) {
  return (
        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                    {/* <p className={`text-xs mt-1 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat?.change} from last month
                    </p> */}
                </div>
                <div className={`${stat.color} text-2xl`}>
                {stat.icon}
                </div>
            </div>
        </div>
  )
}
