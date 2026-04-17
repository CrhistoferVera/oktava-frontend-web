import { useMemo } from 'react';
import { Client, ClientSegment, ClientSegmentSummary } from '@/types/client.types';

const segmentConfig: Record<ClientSegment, Omit<ClientSegmentSummary, 'count'>> = {
  vip: {
    segment: 'vip',
    label: 'VIP (50+ pedidos)',
    criteria: '50+ pedidos',
  },
  frequent: {
    segment: 'frequent',
    label: 'Frecuentes (20-49)',
    criteria: '20-49 pedidos',
  },
  new: {
    segment: 'new',
    label: 'Nuevos (< 20)',
    criteria: 'Menos de 20 pedidos',
  },
};

const dotColor: Record<ClientSegment, string> = {
  vip: 'bg-amber-400',
  frequent: 'bg-blue-400',
  new: 'bg-emerald-400',
};

type ClientsSegmentSummaryProps = {
  clients: Client[];
};

export function ClientsSegmentSummary({ clients }: ClientsSegmentSummaryProps) {
  const summaries = useMemo((): ClientSegmentSummary[] => {
    const counts = clients.reduce<Record<ClientSegment, number>>(
      (acc, client) => {
        acc[client.segment] = (acc[client.segment] ?? 0) + 1;
        return acc;
      },
      { vip: 0, frequent: 0, new: 0 },
    );

    return (['vip', 'frequent', 'new'] as ClientSegment[]).map((seg) => ({
      ...segmentConfig[seg],
      count: counts[seg],
    }));
  }, [clients]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {summaries.map((summary) => (
        <div
          key={summary.segment}
          className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-5"
        >
          <span
            className={`h-3 w-3 flex-shrink-0 rounded-full ${dotColor[summary.segment]}`}
          />
          <div>
            <p className="text-sm text-zinc-400">{summary.label}</p>
            <p className="mt-1 text-2xl font-bold text-white">
              {summary.count}{' '}
              <span className="text-base font-normal text-zinc-400">
                {summary.count === 1 ? 'cliente' : 'clientes'}
              </span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
