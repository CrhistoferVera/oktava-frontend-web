'use client';

import { InputHTMLAttributes, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label: string;
}

export function PasswordInput({ label, id, className = '', ...props }: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-sm text-gray-400 font-medium"
            >
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={showPassword ? 'text' : 'password'}
                    className={`
                        w-full
                        bg-black
                        border border-gray-700
                        rounded-lg
                        px-4 py-3
                        pr-12
                        text-gray-300
                        placeholder-gray-600
                        focus:outline-none
                        focus:ring-2
                        focus:ring-red-500
                        focus:border-transparent
                        transition-all
                        ${className}
                    `}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors focus:outline-none"
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                    ) : (
                        <Eye className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}