'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const MAPS_LINK = 'https://maps.app.goo.gl/F7C2gFg2tNZeBKQY6';

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(MAPS_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso — el botón de Google Maps sigue disponible
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-2xl border px-6 py-3 text-sm font-semibold transition-all ${
        copied
          ? 'border-green-500/40 bg-green-500/10 text-green-300'
          : 'border-white/20 bg-white/5 backdrop-blur-sm text-zinc-100 hover:border-white/30 hover:bg-white/10'
      }`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Enlace copiado' : 'Copiar enlace'}
    </button>
  );
}
