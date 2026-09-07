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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between h-16 px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          const isLocked = item.requiresAuth && !isAuthenticated

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full min-w-0 px-0.5 py-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Контейнер иконки с абсолютным позиционированием замка */}
              <div className="relative flex items-center justify-center p-1">
                <Icon className="h-5 w-5 shrink-0" />

                {/* Замок как компактная метка в углу иконки */}
                {isLocked && (
                  <Lock className="absolute -top-1 -right-2 h-3 w-3 text-muted-foreground/80 shrink-0" />
                )}
              </div>

              {/* Текст подписи с защитой от сплющивания */}
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