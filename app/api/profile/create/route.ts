import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

interface LocationData {
  coordinates: [number, number]
  place_name: string
  address: string
  city: string
  region: string
  country: string
  postal_code: string | null
  context: {
    neighborhood: string | null
    district: string | null
    [key: string]: string | null
  }
}

interface CreateProfileRequest {
  firstName: string
  lastName: string
  dateOfBirth: string
  nationality: string
  location: string
  locationData: LocationData | null
  userType: string
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

    const data: CreateProfileRequest = await request.json()

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.dateOfBirth || !data.nationality || !data.location || !data.userType) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth,
        nationality: data.nationality,
        location: data.locationData || { address: data.location },
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      if (profileError.code === '23505') { // Unique violation
        return NextResponse.json(
          { error: 'Profile already exists for this user' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    // Create user type association
    const { error: userTypeError } = await supabase
      .from('user_to_user_type')
      .insert({
        user_id: user.id,
        user_type_id: parseInt(data.userType)
      })

    if (userTypeError) {
      console.error('Error creating user type association:', userTypeError)
      // If user type creation fails, try to clean up the profile
      await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)

      if (userTypeError.code === '23505') {
        return NextResponse.json(
          { error: 'User type association already exists' },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to create user type association' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      redirectTo: '/dashboard'
    })
  } catch (error) {
    console.error('Error creating user profile:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred while creating profile' },
      { status: 500 }
    )
  }
}