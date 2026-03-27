import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * Crea una instancia de axios para usar en Server Components o Server Actions.
 * El token se pasa explícitamente para evitar depender del contexto de request.
 *
 * Uso:
 *   const cookieStore = await cookies();
 *   const token = cookieStore.get('token')?.value;
 *   const api = createServerApi(token);
 *   const data = await api.get('/ruta');
 */
export function createServerApi(token?: string) {
  return axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
