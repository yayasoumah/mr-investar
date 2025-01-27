"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function UpdatePasswordForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      // Redirect to sign in page after successful password update
      router.push('/auth/signin')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#EF4444]">
          {error}
        </Alert>
      )}
      
      <div className="space-y-3">
        <Label htmlFor="password" className="text-grey-600 font-medium">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#3FD3CC] hover:bg-[#36B3AD] text-white font-semibold rounded-[25px] px-6 py-3 transition-colors duration-150"
        disabled={loading}
      >
        {loading ? 'Updating password...' : 'Update password'}
      </Button>
    </form>
  )
} 