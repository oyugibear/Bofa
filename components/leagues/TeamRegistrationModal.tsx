'use client'

import { Modal, Form, Input, Button, message } from 'antd'
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons'
import { TeamRegistrationData, teamsApi } from '@/lib/api/teams'

const { TextArea } = Input

interface TeamRegistrationModalProps {
  visible: boolean
  onClose: () => void
  leagueId?: string
  onSuccess?: () => void
}

export default function TeamRegistrationModal({
  visible,
  onClose,
  leagueId,
  onSuccess
}: TeamRegistrationModalProps) {
  const [form] = Form.useForm()

  const handleSubmit = async (values: any) => {
    try {
      const registrationData: TeamRegistrationData = {
        name: values.teamName,
        coach: values.coachName,
        captain: values.captainName,
        members: values.playerNames ? values.playerNames.split('\n').filter((name: string) => name.trim()) : [],
        contactEmail: values.email,
        contactPhone: values.phone,
        leagueId: leagueId || ''
      }

      await teamsApi.registerTeam(registrationData)
      
      message.success('Team registration submitted successfully! You will be contacted soon.')
      form.resetFields()
      onClose()
      onSuccess?.()
    } catch (error: any) {
      console.error('Registration error:', error)
      message.error(error.message || 'Failed to register team. Please try again.')
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Register Your Team"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          name="teamName"
          label="Team Name"
          rules={[
            { required: true, message: 'Please enter your team name' },
            { min: 3, message: 'Team name must be at least 3 characters' }
          ]}
        >
          <Input 
            prefix={<TeamOutlined />} 
            placeholder="Enter your team name"
            size="large"
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="coachName"
            label="Coach Name"
            rules={[{ required: true, message: 'Please enter coach name' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Coach full name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="captainName"
            label="Captain Name"
            rules={[{ required: true, message: 'Please enter captain name' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Captain full name"
              size="large"
            />
          </Form.Item>
        </div>

        <Form.Item
          name="playerNames"
          label="Player Names"
          rules={[{ required: true, message: 'Please enter player names' }]}
          extra="Enter each player name on a new line (minimum 11 players)"
        >
          <TextArea
            placeholder="Player 1 Full Name&#10;Player 2 Full Name&#10;Player 3 Full Name&#10;..."
            rows={6}
          />
        </Form.Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            name="email"
            label="Contact Email"
            rules={[
              { required: true, message: 'Please enter contact email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="team@example.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Contact Phone"
            rules={[
              { required: true, message: 'Please enter contact phone' },
              { pattern: /^[+]?[\d\s-()]+$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="+254 7XX XXX XXX"
              size="large"
            />
          </Form.Item>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={handleCancel} size="large">
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit"
            size="large"
            className="bg-[#3A8726FF] hover:bg-[#2d6b1f]"
          >
            Register Team
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
