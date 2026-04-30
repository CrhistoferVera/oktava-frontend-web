'use client';

import { Check, X } from 'lucide-react';

export interface PasswordValidation {
  minLength: boolean;
  hasLetter: boolean;
  hasNumber: boolean;
}

interface PasswordRequirementsProps {
  password: string;
  show?: boolean;
}

export function validatePassword(password: string): PasswordValidation {
  return {
    minLength: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password),
  };
}

export function isPasswordValid(password: string): boolean {
  return Object.values(validatePassword(password)).every(Boolean);
}

export function PasswordRequirements({ password, show = true }: PasswordRequirementsProps) {
  if (!show) return null;

  const v = validatePassword(password);

  const requirements = [
    { key: 'minLength', label: 'Al menos 8 caracteres', valid: v.minLength },
    { key: 'hasLetter',  label: 'Al menos una letra',    valid: v.hasLetter  },
    { key: 'hasNumber',  label: 'Al menos un número',    valid: v.hasNumber  },
  ];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 space-y-1.5">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-2">
        Requisitos
      </p>
      {requirements.map((req) => (
        <div
          key={req.key}
          className={`flex items-center gap-2 text-sm transition-colors ${
            req.valid ? 'text-green-400' : 'text-zinc-600'
          }`}
        >
          {req.valid
            ? <Check className="w-3.5 h-3.5 shrink-0" />
            : <X     className="w-3.5 h-3.5 shrink-0" />}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
