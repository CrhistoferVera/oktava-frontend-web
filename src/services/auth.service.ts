import { api } from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/index';

export const authService = {
  login: async (credentials: LoginDto) => {
    const { data } = await api.post<AuthResponse>('/auth/sign-in', credentials);
    return data;
  },

  sendVerification: async (email: string) => {
    await api.post('/auth/send-verification', { email });
  },

  signup: async (userData: RegisterDto & { verificationCode: string }) => {
    const { data } = await api.post<AuthResponse>('/auth/sign-up', userData);
    return data;
  },
};