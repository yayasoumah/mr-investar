import { NextResponse } from 'next/server'
import { isEmailInAdminWhitelist } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

interface CreateAdminProfileRequest {
  firstName: string
  lastName: string
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient()
    
    // Get access token from cookie
    const accessToken = cookieStore.get('sb-access-token')?.value
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token found. Please sign in again.' },
        { status: 401 }
      )
    }

    // Set session manually
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: cookieStore.get('sb-refresh-token')?.value || '',
    })

    if (sessionError) {
      return NextResponse.json(
        { error: 'Invalid session. Please sign in again.' },
        { status: 401 }
      )
    }

    const data: CreateAdminProfileRequest = await request.json()

    // Validate required fields
    if (!data.firstName || !data.lastName) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      )
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Could not verify user. Please sign in again.' },
        { status: 401 }
      )
    }
    
    // Verify user is in admin whitelist
    if (!isEmailInAdminWhitelist(user.email || '')) {
      return NextResponse.json(
        { error: 'User not authorized for admin access' },
        { status: 403 }
      )
    }

    // Create admin profile
    const { error: profileError } = await supabase
      .from('admin_profiles')
      .insert({
        id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      if (profileError.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'Admin profile already exists for this user' },
          { status: 400 }
        )
      }
      throw profileError
    }

    return NextResponse.json({
      success: true,
      message: 'Admin profile created successfully',
      redirectTo: '/admin/dashboard'
    })
  } catch (error) {
    console.error('Error creating admin profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while creating admin profile' },
      { status: 500 }
    )
  }
}