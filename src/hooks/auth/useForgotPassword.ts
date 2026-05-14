'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

type Step = 'form' | 'sent';

export const useForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword(email.trim());
      setStep('sent');
    } catch (err: any) {
      // 400 de class-validator (email inválido): mostrar el error
      const msg = err?.response?.data?.message;
      const readable = Array.isArray(msg) ? msg[0] : msg;
      if (readable) {
        setError(readable);
      } else {
        // Error de red u otro: avanzar igual para no revelar información
        setStep('sent');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const goToResetPassword = () => {
    router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
  };

  return { email, setEmail, step, error, isLoading, handleSubmit, goToResetPassword };
};
