'use client';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import { PasswordInput } from '../ui/PasswordInput';
import { Logo } from '../ui/Logo';
import { PasswordRequirements } from '../ui/PasswordRequirements';
import { TermsCheckbox } from './TermsCheckBox';
import { useSignUp } from '@/hooks/auth/useSignUp';

export const SignUpForm = () => {
    const router = useRouter();

    const {acceptedTerms,confirmPassword,email,error,firstName,
      handleSignUp,isLoading,lastName,password,phone,
      setConfirmPassword,setEmail,setFirstName,
      setLastName,setPassword,setPhone,setAcceptedTerms}=useSignUp();
  return (
    <div className="min-h-screen bg-gradient-to-t from-red-950 to-black flex flex-col md:flex-row items-center justify-center gap-8 px-5">
      <div className="w-full md:w-[30%] text-center">
        <div className="text-5xl font-extrabold pb-5 pt-10 flex items-center justify-center gap-2">
          <p className="text-red-500">OK</p>
          <p className="text-white">TA</p>
          <p className="text-red-500">VA</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 pt-3">
            Crea tu cuenta gratis
        </h1>
        <p className="text-gray-400">
          Crea tu cuenta y comienza a disfrutar de Oktava
        </p>
        <p className='hidden md:block'>
        <Logo desktopSize={264}/>
        </p>
      </div>

      <form onSubmit={handleSignUp} className="w-full md:w-[35%] space-y-3 p-2">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-white px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <h1 className="text-3xl font-bold text-white text-center  ">Crear Cuenta</h1>
        <div className='md:flex md:gap-4 space-y-3 md:space-y-0'>
            <Input
            label="Nombre"
            id="firstName"
            type="text"
            placeholder="Tu nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            maxLength={254}
            disabled={isLoading}
            className="min-w-0"
            />
            <Input
            label="Apellido"
            id="lastName"
            type="text"
            placeholder="Tu apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            maxLength={254}
            disabled={isLoading}
            className="min-w-0"
            />
        </div>
        <Input
          label="Correo electrónico"
          id="email"
          type="email"
          placeholder="tu@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
          disabled={isLoading}
        />
        <Input
            label="Número de teléfono"
            id="phoneNumber"
            type="tel"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            maxLength={20}
            disabled={isLoading}
        />
        <div className='md:flex md:gap-10 space-y-3'>
            <PasswordInput
            label="Contraseña"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="**********"
            required
            maxLength={128}
            disabled={isLoading}
            />
            <PasswordInput
                label="Confirmar Contraseña"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="**********"
                required
                maxLength={128}
                disabled={isLoading}
            />
        </div>
        <PasswordRequirements password={password} show={password.length > 0} />
        <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} />
        <Button type="submit" className="w-full" variant="primary">
          {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => router.push('/')}
            disabled={isLoading}
          >
            Volver
          </Button>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-1 bg-black text-gray-400">O continúa con</span>
          </div>
        </div>

        <GoogleButton disabled={isLoading} />

        <p className="text-center text-gray-400 text-sm">
          Ya tienes cuenta?{' '}
          <Link
            href="/sign-in"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};
