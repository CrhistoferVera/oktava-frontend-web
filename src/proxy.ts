import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/sign-in', '/sign-up'];
const PROTECTED_PREFIXES = ['/orders', '/admin', '/profile', '/addresses'];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  // Rutas protegidas sin token → login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Ya autenticado intentando ir al login → menú
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/menu', request.url));
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