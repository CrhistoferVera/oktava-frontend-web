'use client';

import { Check, X } from 'lucide-react';

export interface PasswordValidation {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
}

interface PasswordRequirementsProps {
    password: string;
    show?: boolean;
}

export function validatePassword(password: string): PasswordValidation {
    return {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(password),
    };
}

export function isPasswordValid(password: string): boolean {
    const validation = validatePassword(password);
    return Object.values(validation).every(Boolean);
}

export function PasswordRequirements({ password, show = true }: PasswordRequirementsProps) {
    if (!show) return null;

    const validation = validatePassword(password);

    const requirements = [
        { key: 'minLength', label: 'Al menos 8 caracteres', valid: validation.minLength },
        { key: 'hasUppercase', label: 'Una letra mayuscula', valid: validation.hasUppercase },
        { key: 'hasLowercase', label: 'Una letra minuscula', valid: validation.hasLowercase },
        { key: 'hasNumber', label: 'Un numero', valid: validation.hasNumber },
        { key: 'hasSpecialChar', label: 'Un caracter especial (!@#$%...)', valid: validation.hasSpecialChar },
    ];

    return (
        <div className="bg-[#0a1929]/50 border border-gray-700/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-400 font-medium mb-3">Requisitos de la contraseña:</p>
            <div className="grid grid-cols-1 gap-2">
                {requirements.map((req) => (
                    <div
                        key={req.key}
                        className={`flex items-center gap-2 text-sm transition-colors ${
                            req.valid ? 'text-emerald-400' : 'text-gray-500'
                        }`}
                    >
                        {req.valid ? (
                            <Check className="w-4 h-4 flex-shrink-0" />
                        ) : (
                            <X className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span>{req.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}