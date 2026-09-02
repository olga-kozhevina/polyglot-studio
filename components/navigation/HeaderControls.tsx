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
    <div className="flex items-center gap-3">
      {/* Визуальный чип языковой пары */}
      <div className="flex items-center rounded-lg border bg-muted/40 p-1 text-sm font-medium">
        {/* Выпадающее меню выбора изучаемого языка */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-27.5 justify-between px-2.5 hover:bg-background font-medium text-foreground text-sm leading-none cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate" suppressHydrationWarning>
                  {currentLang.label}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-27.5 min-w-27.5">
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

        {/* Разделитель и наглядный указатель перевода на русский */}
        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground mx-1 shrink-0" />

        <div className="px-2.5 py-1 text-muted-foreground font-medium text-sm leading-none whitespace-nowrap">
          Русский
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}