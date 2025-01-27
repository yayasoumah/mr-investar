import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  
  await supabase.auth.signOut()
  
  const response = NextResponse.json({
    success: true
  })

  // Remove auth cookies
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  return response
} 