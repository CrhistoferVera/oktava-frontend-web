'use client';

import { MapPin, Pencil, Phone, Tag, Trash2 } from 'lucide-react';
import type { Address } from '@/types/address.types';

interface AddressCardProps {
  address: Address;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({ address, isDeleting, onEdit, onDelete }: AddressCardProps) {
  return (
    <article className="oktava-surface rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-red-600/20 border border-red-500/20">
            <MapPin size={16} className="text-red-400" />
          </div>
          <span className="font-semibold text-white">{address.label}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onEdit}
            disabled={isDeleting}
            className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:text-white disabled:opacity-40"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="grid h-8 w-8 place-items-center rounded-xl border border-red-900/40 bg-red-950/30 text-red-400 transition hover:bg-red-900/40 disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-zinc-400">
        <p className="flex items-start gap-2">
          <Tag size={13} className="mt-0.5 shrink-0 text-zinc-600" />
          {address.direction}
          {address.departament && `, ${address.departament}`}
        </p>
        {address.reference && (
          <p className="flex items-start gap-2">
            <MapPin size={13} className="mt-0.5 shrink-0 text-zinc-600" />
            {address.reference}
          </p>
        )}
        {address.contact && (
          <p className="flex items-center gap-2">
            <Phone size={13} className="shrink-0 text-zinc-600" />
            {address.contact}
          </p>
        )}
      </div>
    </article>
  );
}
