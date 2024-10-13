import { NextResponse, type NextRequest } from 'next/server'
 
const authPaths = ['/auth/login', '/auth/signup']
const privatePaths = ['/']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log(token)
 
  if (token && authPaths.includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/', request.url))
  }
 
  if (!token && privatePaths.includes(request.nextUrl.pathname)) {
    return Response.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}