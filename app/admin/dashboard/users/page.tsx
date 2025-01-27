"use client"

import { useEffect, useState } from "react"
import { UsersTable } from "./components/users-table"

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  date_of_birth: string
  nationality: string
  location: {
    city: string
    region: string
    country: string
  }
  updated_at: string
  user_types: Array<{
    user_type: {
      name: string
    }
  }>
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users")
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>

      <UsersTable users={users} />
    </div>
  )
}