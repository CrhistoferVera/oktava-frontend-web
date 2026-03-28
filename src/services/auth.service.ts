// src/services/auth.service.ts
import  {api} from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/index';

export const authService = {
    // Login
    login: async (credentials: LoginDto) => {
        const { data } = await api.post<AuthResponse>('/auth/sign-in', credentials);
        return data;
    },

    signup: async (userData: RegisterDto) => {
        const { data } = await api.post<AuthResponse>('/auth/sign-up', userData);
        return data;
    },  
};