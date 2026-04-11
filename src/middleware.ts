import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in') || 
                     request.nextUrl.pathname.startsWith('/sign-up');

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url)); // Cambia '/dashboard' por tu ruta principal
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - api (rutas de la API)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico (archivo de icono)
     * - auth/callback (callback de OAuth, setea cookies antes de redirigir)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)',
  ],
};