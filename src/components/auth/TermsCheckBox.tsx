'use client';

import { useState } from 'react';
import { TermsModal } from './TermsModal';
import {PrivacyModal} from './Privacy'

interface TermsCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export const TermsCheckbox = ({ checked, onChange }: TermsCheckboxProps) => {

    const [isModalOpen1, setIsModalOpen1] = useState(false);

    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const handleLinkClick1 = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen1(true);
    };

    const handleLinkClick2 = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsModalOpen2(true);
    };

    return (
        <>
            <div className="flex items-start space-x-3">
                <input
                    type="checkbox"
                    id="terms"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-700 bg-[#1a2332] text-red-500 focus:ring-2 focus:ring-red-500"
                    required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                    Yo acepto los{' '}
                    <button
                        type="button"
                        onClick={handleLinkClick1}
                        className="text-red-400 hover:text-red-300 transition-colors underline"
                    >
                        Terminos y Condiciones
                    </button>
                    {' '}y{' '}
                    <button
                        type="button"
                        onClick={handleLinkClick2}
                        className="text-red-400 hover:text-red-300 transition-colors underline"
                    >
                        Politicas de privacidad
                    </button>
                </label>
            </div>

            <TermsModal isOpen={isModalOpen1} onClose={() => setIsModalOpen1(false)} />

            <PrivacyModal isOpen={isModalOpen2} onClose={() => setIsModalOpen2(false)} />
        </>
    );
};