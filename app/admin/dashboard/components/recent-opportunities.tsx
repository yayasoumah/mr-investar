import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

interface Opportunity {
  id: string
  title: string
  visibility: string
  location: {
    city: string
    country: string
  }
  updated_at: string
}

interface RecentOpportunitiesProps {
  opportunities: Opportunity[]
}

const visibilityColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  private: "bg-yellow-100 text-yellow-800",
  coming_soon: "bg-blue-100 text-blue-800",
  concluded: "bg-purple-100 text-purple-800",
}

export function RecentOpportunities({ opportunities }: RecentOpportunitiesProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Opportunities</h2>
        <Link
          href="/admin/dashboard/opportunities"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="border-b pb-4">
            <div className="flex justify-between items-start">
              <div>
                <Link
                  href={`/admin/dashboard/opportunities/${opportunity.id}`}
                  className="text-sm font-medium hover:underline"
                >
                  {opportunity.title}
                </Link>
                <p className="text-sm text-gray-500">
                  {opportunity.location.city}, {opportunity.location.country}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={visibilityColors[opportunity.visibility]}
              >
                {opportunity.visibility}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Updated {formatDate(opportunity.updated_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
