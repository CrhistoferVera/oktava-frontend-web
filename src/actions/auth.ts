'use server'

import {cookies} from 'next/headers';

export async function createSession(token: string, userData: any) {
  const cookieStore = await cookies(); // await es necesario en Next.js 15+
  
  // 1. Guardamos el Token de forma segura (HttpOnly)
  cookieStore.set('token', token, {
    httpOnly: true, // El navegador bloquea el acceso vía JavaScript (previene XSS)
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    maxAge: 60 * 60 * 24 * 7, // 1 semana de duración
    path: '/',
  });

  // 2. Guardamos los datos del usuario (No HttpOnly, para leerlos en el Contexto)
  cookieStore.set('user', JSON.stringify(userData), {
    httpOnly: false, 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete('token');
  cookieStore.delete('user');
}