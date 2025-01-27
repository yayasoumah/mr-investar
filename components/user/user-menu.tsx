"use client"

import { LogOut, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/auth'

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-9 w-9 rounded-full bg-grey-100/50 text-secondary hover:text-primary transition-colors"
        >
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2 bg-white border border-grey-200 rounded-lg p-1 shadow-none"
        sideOffset={5}
      >
        <DropdownMenuItem
          onClick={() => signOut()}
          className="flex items-center px-3 py-2.5 text-sm rounded-md text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 