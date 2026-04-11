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
      httpOnly: true,
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

    const redirectPath = userData.role === 'ADMIN' ? '/admin/dashboard' : '/';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }
}
