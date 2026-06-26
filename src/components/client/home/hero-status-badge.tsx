'use client';

import { useEffect, useState } from 'react';
import { storeService } from '@/services/store.service';
import type { StoreStatus } from '@/types/store.types';

export function HeroStatusBadge() {
  const [status, setStatus] = useState<StoreStatus | null>(null);

  useEffect(() => {
    storeService.getStatus().then(setStatus).catch(() => {});
  }, []);

  // Fail-open: hasta tener respuesta (o si falla la red) mostramos "Abierto".
  const isOpen = status ? status.isOpen : true;

  return (
    <div className="space-y-2">
      <span
        className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-bold uppercase tracking-widest backdrop-blur-sm ${
          isOpen
            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
            : 'border-red-500/50 bg-red-500/15 text-red-300'
        }`}
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
          }`}
        />
        {isOpen ? 'Abierto ahora' : 'Cerrado'}
      </span>
      {!isOpen && status?.message && (
        <p className="text-sm font-semibold text-red-300">{status.message}</p>
      )}
    </div>
  );
}
