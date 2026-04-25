'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface Country {
  name: string;
  flag: string;
  dialCode: string;
}

export const COUNTRIES: Country[] = [
  { name: 'Bolivia',    flag: '🇧🇴', dialCode: '+591' },
  { name: 'Argentina',  flag: '🇦🇷', dialCode: '+54'  },
  { name: 'Brasil',     flag: '🇧🇷', dialCode: '+55'  },
  { name: 'Chile',      flag: '🇨🇱', dialCode: '+56'  },
  { name: 'Colombia',   flag: '🇨🇴', dialCode: '+57'  },
  { name: 'México',     flag: '🇲🇽', dialCode: '+52'  },
  { name: 'Paraguay',   flag: '🇵🇾', dialCode: '+595' },
  { name: 'Perú',       flag: '🇵🇪', dialCode: '+51'  },
  { name: 'Uruguay',    flag: '🇺🇾', dialCode: '+598' },
  { name: 'Venezuela',  flag: '🇻🇪', dialCode: '+58'  },
  { name: 'EE.UU.',     flag: '🇺🇸', dialCode: '+1'   },
  { name: 'España',     flag: '🇪🇸', dialCode: '+34'  },
];

interface PhoneInputProps {
  value: string;
  onChange: (fullNumber: string) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function PhoneInput({
  value,
  onChange,
  disabled = false,
  label = 'Número de teléfono',
  id = 'phone',
}: PhoneInputProps) {
  const [selected, setSelected] = useState<Country>(COUNTRIES[0]);
  const [open, setOpen] = useState(false);
  const [localNumber, setLocalNumber] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync external value → local state (useful for reset)
  useEffect(() => {
    if (!value) { setLocalNumber(''); return; }
    const match = COUNTRIES.find((c) => value.startsWith(c.dialCode));
    if (match) {
      setSelected(match);
      setLocalNumber(value.slice(match.dialCode.length).trimStart());
    } else {
      setLocalNumber(value);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelectCountry(country: Country) {
    setSelected(country);
    setOpen(false);
    onChange(`${country.dialCode}${localNumber}`);
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '');
    setLocalNumber(raw);
    onChange(`${selected.dialCode}${raw}`);
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-zinc-400">
          {label}
        </label>
      )}
      <div className="flex gap-0 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden focus-within:border-red-500 transition-colors">
        {/* Country selector */}
        <div ref={dropdownRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            disabled={disabled}
            className="flex h-full items-center gap-1.5 border-r border-zinc-800 px-3 text-sm text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            <span className="text-base leading-none">{selected.flag}</span>
            <span className="text-zinc-400 text-xs font-mono">{selected.dialCode}</span>
            <ChevronDown size={13} className={`text-zinc-600 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute left-0 top-full z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
              <div className="max-h-56 overflow-y-auto">
                {COUNTRIES.map((country) => (
                  <button
                    key={country.dialCode + country.name}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-zinc-800 ${
                      selected.name === country.name ? 'bg-red-500/10 text-red-300' : 'text-zinc-200'
                    }`}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="font-mono text-xs text-zinc-500">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          placeholder="70000000"
          value={localNumber}
          onChange={handleNumberChange}
          disabled={disabled}
          className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
        />
      </div>
    </div>
  );
}
