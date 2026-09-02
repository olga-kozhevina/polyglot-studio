'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/config/navigation'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const isAuthenticated = false

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur z-50">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          const isLocked = item.requiresAuth && !isAuthenticated

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />

              <span className="flex items-center gap-0.5">
                <span>{item.label}</span>
                {isLocked && (
                  <Lock className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                )}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}