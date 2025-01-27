import { createClient } from '@/lib/supabase/server'
import { isEmailInAdminWhitelist } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.json()
  const email = formData.email
  const password = formData.password
  
  // Check if email is in admin whitelist
  if (!isEmailInAdminWhitelist(email)) {
    return NextResponse.json({ error: 'Email not authorized for admin access' }, { status: 403 })
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/admin/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    redirectTo: new URL('/admin/auth/verify-email', requestUrl.origin).toString(),
  })
} 