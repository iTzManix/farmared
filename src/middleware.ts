import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const publicRoutes = ['/login'];
const superAdminOnlyRoutes = ['/dashboard/reportes', '/dashboard/tasas-cambio', '/dashboard/configuracion'];

export default withAuth(
  function middleware(req) {
    const { nextUrl, nextauth } = req;

    const isLoggedIn = !!nextauth?.token;
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isSuperAdminRoute = superAdminOnlyRoutes.some((route) =>
      nextUrl.pathname.startsWith(route)
    );

    if (isPublicRoute) {
      if (isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', nextUrl));
      }
      return NextResponse.next();
    }

    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }

    const isSuperAdmin = nextauth?.token?.rol === 'superadmin';

    if (isSuperAdminRoute && !isSuperAdmin) {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|logo.png).*)'],
};
