'use client';
import { createContext, useState, ReactNode, useEffect, useContext, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, removeSession } from '@/actions/auth'; // Importamos las actions
import { User } from '@/types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User, returnTo?: string) => Promise<void>;
  logout: (reason?: string) => Promise<void>;
  updateUser: (partial: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función auxiliar para leer cookies en el cliente
const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(';').shift() || '');
  return null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar la sesión al cargar
  useEffect(() => {
    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (error) {
        console.error("Error al parsear la cookie del usuario", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Iniciar sesión
  // returnTo: ruta a la que volver después del login (p.ej. /checkout, /orders)
  const login = useCallback(async (token: string, userData: User, returnTo?: string) => {
    await createSession(token, userData);
    setUser(userData);
    const target =
      userData.role === 'ADMIN' ? '/admin/dashboard' : (returnTo ?? '/menu');
    router.push(target);
  }, [router]);

  // Cerrar sesión
  // reason: 'expired' para mostrar mensaje de sesión expirada en /sign-in
  const logout = useCallback(async (reason?: string) => {
    await removeSession();
    setUser(null);
    const path = reason ? `/sign-in?reason=${reason}` : '/sign-in';
    router.push(path);
  }, [router]);

  // Limpiar sesión cuando una petición recibe 401.
  // No navega aquí: el SessionExpiredModal en el layout muestra el modal primero.
  useEffect(() => {
    const handler = async () => {
      await removeSession();
      setUser(null);
      globalThis.dispatchEvent(new CustomEvent('auth:session-expired'));
    };
    globalThis.addEventListener('auth:unauthorized', handler);
    return () => globalThis.removeEventListener('auth:unauthorized', handler);
  }, []); // removeSession es un import estable; setUser es un setter estable

  // Actualizar datos del usuario en estado y cookie sin re-autenticar
  const updateUser = useCallback(async (partial: Partial<User>) => {
    if (!user) return;
    const token = getCookie('token') ?? '';
    const updated = { ...user, ...partial };
    await createSession(token, updated);
    setUser(updated);
  }, [user]);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isLoading, login, logout, updateUser }),
    [user, isLoading, login, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};