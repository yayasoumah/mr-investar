"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LocationInput } from '@/components/ui/location-input'
import { useToast } from '@/hooks/use-toast'

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

export function ProfileCompletionForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [nationality, setNationality] = useState('')
  const [location, setLocation] = useState('')
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [userType, setUserType] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth,
          nationality,
          location,
          locationData,
          userType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create profile')
      }

      // Show success toast
      toast({
        title: "Profile Created",
        description: "Your profile has been successfully created. Redirecting to dashboard...",
        duration: 3000,
      })

      // Wait for the toast to be visible before redirecting
      setTimeout(() => {
        // Refresh the router to update middleware checks
        router.refresh()
        // Redirect to dashboard
        router.push('/dashboard')
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      
      // Show error toast
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLocationChange = (value: string, data?: LocationData) => {
    setLocation(value)
    if (data) {
      setLocationData(data)
    } else {
      setLocationData(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive" className="bg-[#FEF2F2] border-l-4 border-[#EF4444] text-[#EF4444]">
          {error}
        </Alert>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
          className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          required
          className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <LocationInput
          value={location}
          onChange={handleLocationChange}
          className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]"
          placeholder="Search for a location in Italy..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="userType">User Type</Label>
        <Select onValueChange={setUserType} required>
          <SelectTrigger className="rounded-md border-[1.5px] border-[#E0E0E0] px-4 py-3 focus:ring-2 focus:ring-[#E6F7F7] focus:border-[#3FD3CC]">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Investor</SelectItem>
            <SelectItem value="2">Property Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#3FD3CC] hover:bg-[#36B3AD] text-white font-semibold rounded-[25px] px-6 py-3 transition-colors duration-150"
        disabled={loading}
      >
        {loading ? 'Creating Profile...' : 'Complete Profile'}
      </Button>
    </form>
  )
} 