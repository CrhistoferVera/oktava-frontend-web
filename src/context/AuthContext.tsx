'use client';
import { createContext, useState, ReactNode, useEffect, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createSession, removeSession } from '@/actions/auth'; // Importamos las actions
import { User } from '@/types';


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
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
        console.error("Error al parsear la cookie del usuario");
      }
    }
    setIsLoading(false);
  }, []);

  // Iniciar sesión
  const login = useCallback(async (token: string, userData: User) => {
    await createSession(token, userData); // Guarda las cookies en el servidor
    setUser(userData); // Actualiza el estado local
    router.refresh(); // Sincroniza caché del cliente con las cookies recién guardadas
    router.push('/admin/dashboard'); // Ajusta a tu ruta protegida
  }, [router]);

  // Cerrar sesión
  const logout = useCallback(async () => {
    await removeSession(); // Borra las cookies en el servidor
    setUser(null);
    router.push('/sign-in');
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
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