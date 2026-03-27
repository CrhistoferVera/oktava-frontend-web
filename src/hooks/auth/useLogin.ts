import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import React, { useState, FormEvent } from 'react'

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {login}= useAuth();

    const handleLogin = async (e:FormEvent<HTMLFormElement>)=>{
      e.preventDefault();
      setIsLoading(true);
      setError(null);

      try{
        const data = await authService.login({email, password});
        await login(data.accessToken, data.user);
      }catch (err){
        setError('Credenciales Invalidas');
      }finally {
        setIsLoading(false);
      }
    }
    return{
      //Props
      email,
      password,
      error,
      isLoading,
      //Methods
      setEmail,
      setPassword,
      handleLogin
  }
}
