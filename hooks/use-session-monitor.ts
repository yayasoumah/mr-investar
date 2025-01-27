import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const useSessionMonitor = () => {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Redirect to sign in page based on the current path
        const isAdmin = window.location.pathname.startsWith('/admin')
        router.push(isAdmin ? '/admin/auth/signin' : '/auth/signin')
      } else if (event === 'TOKEN_REFRESHED') {
        // Optionally handle successful token refresh
        console.log('Session token refreshed')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])
} 
