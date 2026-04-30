import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const userEncoded = request.nextUrl.searchParams.get('user');

  if (!token || !userEncoded) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    const userData = JSON.parse(
      Buffer.from(decodeURIComponent(userEncoded), 'base64').toString('utf-8'),
    );

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    cookieStore.set('user', JSON.stringify(userData), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    let redirectPath = '/menu';
    if (userData.role === 'ADMIN') redirectPath = '/admin/dashboard';
    else if (!userData.phone?.trim()) redirectPath = '/complete-profile';

    const proto = request.headers.get('x-forwarded-proto') ?? 'http';
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? 'localhost:3000';
    const baseUrl = `${proto}://${host}`;
    return NextResponse.redirect(new URL(redirectPath, baseUrl));
  } catch {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
