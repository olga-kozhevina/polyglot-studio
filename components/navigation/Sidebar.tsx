'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/config/navigation'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()
  const isAuthenticated = false

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-card px-4 py-6">
      <Link href="/catalog" className="flex items-center gap-2 px-2 pb-6">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
          P
        </div>
        <span className="text-lg font-bold tracking-tight">Polyglot Studio</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          const isLocked = item.requiresAuth && !isAuthenticated

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              
              {/* Небольшой бейдж-замок для приватных разделов при отсутствии авторизации */}
              {isLocked && (
                <Lock className="h-3.5 w-3.5 text-muted-foreground/60" />
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}