import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't need auth
const publicRoutes = ['/', '/auth/signin', '/admin/auth/signin', '/auth/signup', '/admin/auth/signup']

// Auth routes that should bypass token type checks
const authRoutes = [
  '/auth/callback',
  '/admin/auth/callback',
  '/auth/complete-profile',
  '/admin/auth/complete-profile'
]

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname
    
    // Skip token checks for public routes
    if (publicRoutes.includes(pathname)) {
      return response
    }

    // Get auth tokens from cookies
    const accessToken = request.cookies.get('sb-access-token')?.value
    const refreshToken = request.cookies.get('sb-refresh-token')?.value
    const tokenType = request.cookies.get('token-type')?.value

    // Create Supabase client
    const supabase = createClient()

    let user = null
    let sessionError = null

    if (accessToken && refreshToken) {
      try {
        // Try to refresh the session
        const { data: { user: sessionUser }, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (!error) {
          user = sessionUser
        } else {
          sessionError = error
          console.error('Session refresh error:', error)
        }
      } catch (error) {
        console.error('Session refresh failed:', error)
        sessionError = error
      }
    }

    // If session refresh failed or no tokens, redirect to sign in
    if (sessionError || (!accessToken && !refreshToken)) {
      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/auth/signin', request.url))
      }
      if (pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }
    }

    // Handle auth routes
    if (authRoutes.includes(pathname)) {
      if (!user) {
        return NextResponse.redirect(
          new URL(
            pathname.startsWith('/admin') ? '/admin/auth/signin' : '/auth/signin',
            request.url
          )
        )
      }
      return response
    }

    // Protected admin routes
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/auth')) {
      if (!user) {
        return NextResponse.redirect(new URL('/admin/auth/signin', request.url))
      }
      if (tokenType !== 'admin') {
        return NextResponse.redirect(new URL('/admin/auth/signin?error=unauthorized', request.url))
      }
      return response
    }

    // Protected user routes
    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        return NextResponse.redirect(new URL('/auth/signin', request.url))
      }
      if (tokenType !== 'user') {
        return NextResponse.redirect(new URL('/auth/signin?error=unauthorized', request.url))
      }
      return response
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    // In case of unexpected errors, redirect to sign in
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}