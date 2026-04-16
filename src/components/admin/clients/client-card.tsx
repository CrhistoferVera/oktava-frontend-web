import React from 'react';
import { Client, ClientSegment } from '@/types/client.types';

const segmentBadge: Record<ClientSegment, { label: string; className: string }> = {
  vip: {
    label: 'VIP',
    className: 'bg-amber-400/15 text-amber-400',
  },
  frequent: {
    label: 'Frecuente',
    className: 'bg-blue-400/15 text-blue-400',
  },
  new: {
    label: 'Nuevo',
    className: 'bg-emerald-500/15 text-emerald-400',
  },
};

const avatarColor: Record<ClientSegment, string> = {
  vip: 'bg-red-600',
  frequent: 'bg-blue-600',
  new: 'bg-emerald-600',
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

type ClientCardProps = {
  client: Client;
};

export function ClientCard({ client }: ClientCardProps) {
  const badge = segmentBadge[client.segment];
  const initials = getInitials(client.firstName, client.lastName);

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
      <div className="flex flex-col gap-5 p-6">
        {/* Top row: avatar + name + rating */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full ${avatarColor[client.segment]} text-lg font-bold text-white`}
            >
              {initials}
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-white">
                {client.firstName} {client.lastName}
              </h3>
              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}
              >
                {badge.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-amber-400">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-base font-semibold text-white">
              {client.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="truncate">{client.email}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>{client.phone}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate">{client.address}</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-black/30 px-4 py-3">
            <p className="text-sm text-zinc-500">Pedidos</p>
            <p className="mt-2 text-xl font-bold text-white">
              {client.totalOrders}
            </p>
          </div>

          <div className="rounded-2xl bg-black/30 px-4 py-3">
            <p className="text-sm text-zinc-500">Total gastado</p>
            <p className="mt-2 text-xl font-bold text-white">
              Bs. {client.totalSpent.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
