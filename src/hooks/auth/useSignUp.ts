'use client';

import { useState, useRef } from 'react';
import { isPasswordValid } from '@/components/ui/PasswordRequirements';
import { authService } from '@/services/auth.service';
import type { AuthResponse } from '@/types';
import { useAuth } from '@/context/AuthContext';

type FormSubmit = { preventDefault(): void };

export type SignUpStep = 'form' | 'verify' | 'phone-prompt';

export const useSignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<SignUpStep>('form');
  const [code, setCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingAuthRef = useRef<AuthResponse | null>(null);

  const { login } = useAuth();

  // ─── Step 1: validate form + send email OTP ────────────────────────────────
  const handleSendCode = async (e: FormSubmit) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid(password)) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendVerification(email);
      setStep('verify');
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'No se pudo enviar el código. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 2: verify email OTP + create account → phone prompt ─────────────
  const handleVerifyAndRegister = async (e: FormSubmit) => {
    e.preventDefault();
    if (code.length !== 6) { setError('Ingresa el código de 6 dígitos'); return; }
    setError(null);
    setIsLoading(true);
    try {
      const data = await authService.signup({ email, firstName, lastName, password, phone, verificationCode: code });
      pendingAuthRef.current = data;
      setStep('phone-prompt');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Código incorrecto o expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Step 3a: verify phone now ─────────────────────────────────────────────
  const handleGoVerifyPhone = () => {
    const data = pendingAuthRef.current;
    if (!data) return;
    login(data.accessToken, data.user, '/verify-phone?redirect=/menu');
  };

  // ─── Step 3b: skip phone verification ─────────────────────────────────────
  const handleSkipPhone = () => {
    const data = pendingAuthRef.current;
    if (!data) return;
    login(data.accessToken, data.user);
  };

  // ─── Resend email OTP ──────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setIsLoading(true);
    try {
      await authService.sendVerification(email);
      startCooldown();
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'No se pudo reenviar el código.');
    } finally {
      setIsLoading(false);
    }
  };

  function startCooldown() {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const goBack = () => { setStep('form'); setCode(''); setError(null); };

  return {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    acceptedTerms, setAcceptedTerms,
    code, setCode,
    step, error, isLoading, resendCooldown,
    handleSendCode,
    handleVerifyAndRegister,
    handleGoVerifyPhone,
    handleSkipPhone,
    handleResend,
    goBack,
  };
};
