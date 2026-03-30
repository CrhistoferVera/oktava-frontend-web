
import React from 'react'
import { StatisticList } from '@/components/admin/statistics/StatisticList'

export default function dashboard() {
  return (
    <div className='flex justify-between pr-30'>
        <StatisticList />
    </div>
  )
}
