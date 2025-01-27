"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'

export function AdminProfileCompletionForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      toast({
        title: 'Profile completed',
        description: 'You will be redirected to the admin dashboard.',
      })

      router.push('/admin/dashboard')
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#EF4444] text-sm">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-[#142D42]">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-11 rounded-md border-[1.5px] border-[#E0E0E0] px-4 text-[#142D42] placeholder:text-gray-400
                       focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC] transition-all duration-150"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-[#142D42]">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-11 rounded-md border-[1.5px] border-[#E0E0E0] px-4 text-[#142D42] placeholder:text-gray-400
                       focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC] transition-all duration-150"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 bg-[#3FD3CC] hover:bg-[#36B3AD] text-white font-semibold rounded-[25px] 
                   transition-colors duration-150 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? 'Completing profile...' : 'Complete profile'}
        </Button>
      </form>
    </div>
  )
} 