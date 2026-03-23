'use client';
import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';
import { GoogleButton } from './GoogleButton';
import Link from 'next/link';
import { PasswordInput } from '../ui/PasswordInput';
import { Logo } from '../ui/Logo';

export const SignInForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black flex flex-col md:flex-row items-center justify-center gap-8 px-5">
      <div className="w-full md:w-[30%] text-center">
        <div className="text-5xl font-extrabold pb-5 pt-10 flex items-center justify-center gap-2">
          <p className="text-red-500">OK</p>
          <p className="text-white">TA</p>
          <p className="text-red-500">VA</p>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 pt-5">
          Bienvenido de nuevo
        </h1>
        <p className="text-gray-400">
          Inicia sesión en tu cuenta para continuar
        </p>
        <p className='hidden md:block'>
        <Logo desktopSize={264}/>
        </p>
      </div>

      <form onSubmit={() => {}} className="w-full md:w-[30%] space-y-5 p-2">
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-white px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
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
        <p className="text-center text-gray-400 text-sm">
          <Link
            href="/forgot-password"
            className="text-white hover:text-gray-300 transition-colors text-sm"
          >
            Olvidaste Tu Contrasena?
          </Link>
        </p>
        <Button type="submit" className="w-full" variant="primary">
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
            <span className="px-2 bg-black text-gray-400">O continúa con</span>
          </div>
        </div>

        <GoogleButton disabled={isLoading} />

        <p className="text-center text-gray-400 text-sm">
          No tienes cuenta?{' '}
          <Link
            href="/sign-up"
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
};
