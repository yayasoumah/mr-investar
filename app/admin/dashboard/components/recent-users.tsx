import Link from "next/link"
import { formatDate } from "@/lib/utils"

interface UserType {
  user_type: {
    name: string
  }
}

interface User {
  id: string
  first_name: string
  last_name: string
  nationality: string
  updated_at: string
  user_types: UserType[]
}

interface RecentUsersProps {
  users: User[]
}

export function RecentUsers({ users }: RecentUsersProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Users</h2>
        <Link
          href="/admin/dashboard/users"
          className="text-sm text-primary hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="border-b pb-4">
            <p className="text-sm font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-gray-500">
              {user.nationality} •{" "}
              {user.user_types?.map((t) => t.user_type.name).join(", ") || "-"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Joined {formatDate(user.updated_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
