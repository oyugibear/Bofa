import React from 'react'
import { 
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import StatCard from '../StatCard'

export default function UserStats({users}: {users: any[]}) {
    const stats = [
    { 
      title: 'Total Users', 
      value: users.length, 
      icon: <UserOutlined />, 
      color: 'text-blue-600', 
      change: '',
      subtitle: 'Registered users'
    },
    
    { 
      title: 'Coaches', 
      value: users.filter(user => user.role === 'Coach').length, 
      icon: <TeamOutlined />, 
      color: 'text-purple-600', 
      change: '',
      subtitle: 'Certified coaches'
    },
    { 
      title: 'New This Month', 
      value: users.filter(user => new Date(user.createdAt).getMonth() === new Date().getMonth()).length, 
      icon: <UserOutlined />, 
      color: 'text-orange-600', 
      change: 's',
      subtitle: 'New registrations'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <StatCard index={index} stat={stat} />
      ))}
    </div>
  )
}
