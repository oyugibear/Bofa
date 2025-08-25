import { Space, Table, Tag } from 'antd';
import React from 'react'

export default function SimpleTable({columns, data, scroll}) {
  return (
    <Table columns={columns} dataSource={data} scroll={scroll} className='w-full'/>
  )
}
