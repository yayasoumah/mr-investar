import { createClient } from '@/lib/supabase/server'

// Admin email whitelist - should be moved to environment variables in production
const ADMIN_WHITELIST = process.env.ADMIN_EMAIL_WHITELIST?.split(',') || []

export const isEmailInAdminWhitelist = (email: string) => {
  return ADMIN_WHITELIST.includes(email.toLowerCase())
}

export async function signOut(isAdmin: boolean = false) {
  const supabase = createClient()
  
  // Sign out on the client side
  await supabase.auth.signOut()
  
  // Also sign out on the server side to clear cookies
  await fetch('/api/auth/signout', {
    method: 'POST',
    credentials: 'include',
  })
  
  // Reload the page to clear any client state
  window.location.href = isAdmin ? '/admin/auth/signin' : '/auth/signin'
}

export async function checkProfileCompletion(userId: string) {
  const supabase = createClient()
  
  try {
    // Simply check if user exists in user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      console.error('Error checking profile existence:', profileError)
      return false
    }

    // Check if user has at least one user type
    const { data: userType, error: userTypeError } = await supabase
      .from('user_to_user_type')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()

    if (userTypeError) {
      console.error('Error checking user type:', userTypeError)
      return false
    }

    // Profile is complete if both profile and user type exist
    return profile !== null && userType !== null
  } catch (error) {
    console.error('Error in checkProfileCompletion:', error)
    return false
  }
}

export async function checkAdminProfileCompletion(userId: string) {
  const supabase = createClient()
  
  try {
    // Simply check if admin exists in admin_profiles table
    const { data: profile, error } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error checking admin profile existence:', error)
      return false
    }

    return profile !== null
  } catch (error) {
    console.error('Error in checkAdminProfileCompletion:', error)
    return false
  }
}