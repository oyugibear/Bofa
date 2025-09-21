import React from 'react'

export default function BasicTextOutput({ label, value } : { label: string, value: string | number }) {
  return (
    <div className='flex flex-row border-b border-slate-200 py-3 justify-between'>
      <span className='font-medium'>{label}:</span>
      <span>{value}</span>
    </div>
  )
}
