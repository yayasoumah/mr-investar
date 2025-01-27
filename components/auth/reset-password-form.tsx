"use client"

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'

export function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-[#ECFDF5] border-l-4 border-[#34D399] text-[#34D399]">
        Check your email for the password reset link.
      </Alert>
    )
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#EF4444]">
          {error}
        </Alert>
      )}
      
      <div className="space-y-3">
        <Label htmlFor="email" className="text-grey-600 font-medium">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#3FD3CC] hover:bg-[#36B3AD] text-white font-semibold rounded-[25px] px-6 py-3 transition-colors duration-150"
        disabled={loading}
      >
        {loading ? 'Sending reset link...' : 'Send reset link'}
      </Button>
    </form>
  )
} 