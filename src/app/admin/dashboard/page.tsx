import React from 'react';
import { StatisticList } from '@/components/admin/statistics/StatisticList';
import { RecentOrdersTable } from '@/components/admin/orders/RecentOrdersTable';

export default function dashboard() {
  return (
    <div className="flex flex-col gap-8 pr-8">
      <StatisticList />
      <RecentOrdersTable />
    </div>
  );
}
