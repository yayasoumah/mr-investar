"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"

interface UserType {
  user_type: {
    name: string
  }
}

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
  user_types: UserType[]
}

interface UsersTableProps {
  users: UserProfile[]
}

export function UsersTable({ users }: UsersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Nationality</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.first_name} {user.last_name}
              </TableCell>
              <TableCell>
                {user.user_types?.map(type => type.user_type.name).join(", ") || "-"}
              </TableCell>
              <TableCell>{user.nationality}</TableCell>
              <TableCell>
                {user.location?.city}, {user.location?.country}
              </TableCell>
              <TableCell>{formatDate(user.date_of_birth)}</TableCell>
              <TableCell>{formatDate(user.updated_at)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
