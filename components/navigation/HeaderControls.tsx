'use client'

import { useSettingsStore, TargetLanguage } from '@/store/useSettingsStore'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ArrowRight, ChevronDown, Globe } from 'lucide-react'

const TARGET_LANGUAGES: { code: TargetLanguage; label: string }[] = [
  { code: 'EN', label: 'English' },
  { code: 'FR', label: 'Français' },
  { code: 'TR', label: 'Türkçe' },
]

export function HeaderControls() {
  const { targetLanguage, setTargetLanguage } = useSettingsStore()

  const currentLang =
    TARGET_LANGUAGES.find((lang) => lang.code === targetLanguage) || TARGET_LANGUAGES[0]

  return (
    <div className="flex items-center gap-2 min-[400px]:gap-3 shrink-0">
      {/* Визуальный чип языковой пары */}
      <div className="flex items-center rounded-lg border bg-muted/40 p-1 text-sm font-medium">
        {/* Выпадающее меню выбора изучаемого языка */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-[100px] min-[400px]:w-[110px] justify-between px-2 hover:bg-background font-medium text-foreground text-xs min-[400px]:text-sm leading-none cursor-pointer"
            >
              <div className="flex items-center gap-1 min-w-0">
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate" suppressHydrationWarning>
                  {currentLang.label}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[110px] min-w-[110px]">
            {TARGET_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setTargetLanguage(lang.code)}
                className="cursor-pointer justify-between text-sm"
              >
                <span>{lang.label}</span>
                {targetLanguage === lang.code && (
                  <span className="text-primary font-bold">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Разделительная стрелка */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1 shrink-0" />

        <div className="hidden min-[400px]:block px-2.5 py-1 text-muted-foreground font-medium text-sm leading-none whitespace-nowrap">
          Русский
        </div>
        <div className="min-[400px]:hidden px-1.5 py-1 text-muted-foreground font-medium text-xs leading-none">
          RU
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}