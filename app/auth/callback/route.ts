import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { checkProfileCompletion } from '@/lib/auth'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Exchange code for session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error || !session?.user) {
      return NextResponse.redirect(new URL('/auth/signin?error=auth', requestUrl.origin))
    }

    // Check if this is an email confirmation
    const isEmailConfirmation = requestUrl.searchParams.get('type') === 'signup'

    // Check profile completion
    const isProfileComplete = await checkProfileCompletion(session.user.id)

    // Create response with appropriate redirect
    const redirectUrl = isEmailConfirmation || !isProfileComplete
      ? new URL('/auth/complete-profile', requestUrl.origin)
      : new URL('/dashboard', requestUrl.origin)
    
    const response = NextResponse.redirect(redirectUrl)

    // Set token type cookie
    response.cookies.set('token-type', 'user', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  }

  return NextResponse.redirect(new URL('/auth/signin?error=code', requestUrl.origin))
}

