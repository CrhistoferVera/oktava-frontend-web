import { OrdersTable } from '@/components/admin/orders/OrdersTable'
import { OrderStatusCard } from '@/components/admin/orders/OrderStatusCard'
import { OrderStatusList } from '@/components/admin/orders/OrderStatusList'
import React from 'react'

export default function OrdersPage() {
  return (
    <div className="space-y-8">
    <OrderStatusList/>
    <OrdersTable/>
    </div>
  )
}
