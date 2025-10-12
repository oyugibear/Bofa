'use client'

import { Input, Select, Button, Row, Col, Typography } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'

const { Text } = Typography
const { Search } = Input
const { Option } = Select

interface LeagueFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  filterStatus: string
  setFilterStatus: (value: string) => void
  filterCategory: string
  setFilterCategory: (value: string) => void
  filteredCount: number
  onClearFilters: () => void
}

export default function LeagueFilters({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterCategory,
  setFilterCategory,
  filteredCount,
  onClearFilters
}: LeagueFiltersProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <Search
            placeholder="Search leagues..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:w-64"
            size="large"
            allowClear
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            className="w-full sm:w-32"
            size="large"
          >
            <Option value="all">All Status</Option>
            <Option value="active">Active</Option>
            <Option value="upcoming">Upcoming</Option>
            <Option value="finished">Finished</Option>
          </Select>
          <Select
            value={filterCategory}
            onChange={setFilterCategory}
            className="w-full sm:w-32"
            size="large"
          >
            <Option value="all">All Categories</Option>
            <Option value="adult">Adult</Option>
            <Option value="youth">Youth</Option>
            <Option value="women">Women</Option>
            <Option value="veterans">Veterans</Option>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <Text type="secondary">
            {filteredCount} league{filteredCount !== 1 ? 's' : ''} found
          </Text>
          <Button
            icon={<FilterOutlined />}
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  )
}
