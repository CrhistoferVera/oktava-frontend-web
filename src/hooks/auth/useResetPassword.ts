'use client';

import { useState, FormEvent } from 'react';
import { authService } from '@/services/auth.service';

type Step = 'form' | 'success';

export const useResetPassword = (initialEmail: string) => {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!/^\d{6}$/.test(code)) {
      setError('El código debe ser de 6 dígitos numéricos.');
      return;
    }
    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email.trim(), code, newPassword);
      setStep('success');
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      const readable = Array.isArray(msg) ? msg[0] : msg;
      setError(readable ?? 'El código es inválido o ha expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    code, setCode,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    step, error, isLoading,
    handleSubmit,
  };
};
