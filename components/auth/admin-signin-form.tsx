"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

export function AdminSignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/auth/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in')
      }

      toast({
        title: 'Success',
        description: 'You have been signed in to the admin portal.',
      })

      router.push(data.redirectTo)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#EF4444] text-sm">
          {error}
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-[#142D42]">Admin Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11 rounded-md border-[1.5px] border-[#E0E0E0] px-4 text-[#142D42] placeholder:text-gray-400
                   focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC] transition-all duration-150"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-sm font-medium text-[#142D42]">Password</Label>
          <Link 
            href="/auth/reset-password"
            className="text-sm font-medium text-[#3FD3CC] hover:text-[#36B3AD] transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11 rounded-md border-[1.5px] border-[#E0E0E0] px-4 text-[#142D42]
                   focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC] transition-all duration-150"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 bg-[#3FD3CC] hover:bg-[#36B3AD] text-white font-semibold rounded-[25px] 
                 transition-colors duration-150 flex items-center justify-center"
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign in to Admin Portal'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Need an administrator account?{' '}
        <Link href="/admin/auth/signup" className="font-medium text-[#3FD3CC] hover:text-[#36B3AD] transition-colors">
          Register here
        </Link>
      </p>
    </form>
  )
} 