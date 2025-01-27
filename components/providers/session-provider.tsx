'use client'

import { useSessionMonitor } from '@/hooks/use-session-monitor'

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  useSessionMonitor()
  return <>{children}</>
} 