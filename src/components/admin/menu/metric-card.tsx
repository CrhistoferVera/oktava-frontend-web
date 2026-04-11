import React from 'react';

type MetricCardProps = {
  label: string;
  value: string;
};

export function MenuMetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-2 mb-4">
      <p className="text-base text-zinc-400">{label}</p>
      <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
    </div>
  );
}
