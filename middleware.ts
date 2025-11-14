import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Debug logging
  const token = request.cookies.get('token')?.value;
  console.log('Middleware - Path:', pathname);
  console.log('Middleware - Token exists:', !!token);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Middleware - Token valid:', !!decoded);
    } catch (error) {
      console.log('Middleware - Token invalid:', error);
    }
  }

  // Temporarily allow all routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};