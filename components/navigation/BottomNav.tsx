'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_ITEMS } from '@/config/navigation'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border/80 bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-w-0 px-0.5 py-1 transition-colors select-none',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative flex items-center justify-center p-1">
                <Icon className="h-5 w-5 shrink-0" />
              </div>
              <span className="w-full text-center text-[11px] min-[390px]:text-xs leading-none tracking-tight truncate mt-1">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}