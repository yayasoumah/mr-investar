import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { checkProfileCompletion } from '@/lib/auth'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.json()
  const email = formData.email
  const password = formData.password
  
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!data.session?.user) {
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 })
  }

  // Check profile completion
  const isProfileComplete = await checkProfileCompletion(data.session.user.id)

  // Create response with success data and appropriate redirect
  const response = NextResponse.json({
    success: true,
    redirectTo: isProfileComplete 
      ? new URL('/dashboard', requestUrl.origin).toString()
      : new URL('/auth/complete-profile', requestUrl.origin).toString(),
  })

  // Set auth cookies in the response
  if (data.session) {
    // Set auth token cookies
    response.cookies.set('sb-access-token', data.session.access_token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: data.session.expires_in
    })

    response.cookies.set('sb-refresh-token', data.session.refresh_token!, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    // Set token type cookie
    response.cookies.set('token-type', 'user', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
  }

  return response
}