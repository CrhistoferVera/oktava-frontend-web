import { OrderStatusCard } from '@/components/admin/orders/OrderStatusCard'
import React from 'react'

export default function OrdersPage() {
  return (
    <div className='flex gap-7'>
    <OrderStatusCard  />
    <OrderStatusCard  />
    </div>
  )
}
