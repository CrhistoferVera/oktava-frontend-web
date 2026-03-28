import { StatisticCard } from '@/components/admin/statistics/StatisticCard'
import { StatisticsCard1 } from '@/components/admin/statistics/StatisticsCard1'
import { StatisticCard2 } from '@/components/admin/statistics/StatisticCard2'
import React from 'react'

export default function dashboard() {
  return (
    <div className='flex justify-between pr-30'>
        <StatisticCard/>
        <StatisticsCard1/>
        <StatisticCard2/>
        <StatisticsCard1/>
    </div>
  )
}
