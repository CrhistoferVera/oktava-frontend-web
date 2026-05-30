import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Páginas de auth — si el usuario ya tiene token, redirigir al menú
const AUTH_PAGES = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password'];

// Solo rutas que DEBEN protegerse server-side:
//   /admin         → panel de administración (requiere redirección dura)
//   /complete-profile / /verify-phone → flujos de auth (pasos obligatorios)
//
// /orders, /addresses, /profile están excluidos a propósito:
// sus componentes client muestran un modal de auth antes de redirigir.
const PROTECTED_PREFIXES = [
  '/admin',
  '/complete-profile',
  '/verify-phone',
];

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Ruta protegida sin token → redirigir al login
  if (isProtected && !token) {
    const url = new URL('/sign-in', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Ya autenticado intentando ir a una página de auth → ir al menú
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/menu', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica a todas las rutas excepto:
     * - api (rutas de la API de Next.js)
     * - _next/static / _next/image (assets)
     * - favicon.ico
     * - auth/callback (callback OAuth)
     * - archivos con extensión (imágenes, fuentes, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth/callback|.*\\..*).*)',
  ],
};
