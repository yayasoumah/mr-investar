"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "./components/stats-card"
import { RecentOpportunities } from "./components/recent-opportunities"
import { RecentUsers } from "./components/recent-users"

interface DashboardData {
  stats: {
    totalOpportunities: number
    totalUsers: number
    activeOpportunities: number
  }
  recentOpportunities: Array<{
    id: string
    title: string
    visibility: string
    location: {
      city: string
      country: string
    }
    updated_at: string
  }>
  recentUsers: Array<{
    id: string
    first_name: string
    last_name: string
    nationality: string
    updated_at: string
    user_types: Array<{
      user_type: {
        name: string
      }
    }>
  }>
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard")
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error)
        
        setData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Opportunities"
          value={data.stats.totalOpportunities}
        />
        <StatsCard
          title="Active Opportunities"
          value={data.stats.activeOpportunities}
        />
        <StatsCard
          title="Total Users"
          value={data.stats.totalUsers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOpportunities opportunities={data.recentOpportunities} />
        <RecentUsers users={data.recentUsers} />
      </div>
    </div>
  )
}