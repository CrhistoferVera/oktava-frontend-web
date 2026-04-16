import React from 'react';
import { ClientMetricItem } from '@/types/client.types';

const icons: Record<ClientMetricItem['icon'], React.ReactNode> = {
  trend: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  ticket: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  smile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </svg>
  ),
};

type ClientMetricCardProps = {
  metric: ClientMetricItem;
};

export function ClientMetricCard({ metric }: ClientMetricCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 px-6 py-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {metric.label}
        </p>
        <span className="text-zinc-500">{icons[metric.icon]}</span>
      </div>

      <h3 className="mt-4 text-4xl font-bold text-white">{metric.value}</h3>

      {metric.subValue && (
        <p
          className={`mt-2 text-sm font-medium ${
            metric.trendUp === true
              ? 'text-emerald-400'
              : metric.trendUp === false
                ? 'text-red-400'
                : 'text-zinc-400'
          }`}
        >
          {metric.subValue}
        </p>
      )}
    </div>
  );
}
