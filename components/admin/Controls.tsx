import React from 'react'
import { 
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  PlusOutlined,
} from '@ant-design/icons'

export default function Controls({ setShowModal, setModalType }: any) {
    const quickActions = [
        { label: 'New Booking', action: () => { setModalType('booking'); setShowModal(true) }, icon: <PlusOutlined />, color: 'bg-[#3A8726FF]' },
        { label: 'Add User', action: () => { setModalType('user'); setShowModal(true) }, icon: <UserOutlined />, color: 'bg-blue-600' },
        { label: 'Add Team', action: () => { setModalType('team'); setShowModal(true) }, icon: <TeamOutlined />, color: 'bg-purple-600' },
        { label: 'New League', action: () => { setModalType('league'); setShowModal(true) }, icon: <TrophyOutlined />, color: 'bg-orange-600' },
    ]

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => (
            <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 justify-center font-medium`}
            >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
            </button>
            ))}
        </div>
        </div>
    )
}
