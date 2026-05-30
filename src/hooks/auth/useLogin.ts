import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { useState, FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const searchParams = useSearchParams();

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const data = await authService.login({ email, password });
            // Leer el param ?redirect= de la URL para volver a la ruta original tras login
            const returnTo = searchParams.get('redirect') ?? undefined;
            await login(data.accessToken, data.user, returnTo);
        } catch {
            setError('Credenciales Invalidas');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        password,
        error,
        isLoading,
        setEmail,
        setPassword,
        handleLogin,
    };
};
