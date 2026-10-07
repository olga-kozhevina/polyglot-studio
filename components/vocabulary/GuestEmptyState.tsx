'use client'

import { Badge } from '@/components/ui/badge'
import { BookOpen, Search, Filter } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { GuestFeatureOverlay } from '../layout/GuestFeatureOverlay'

export function GuestEmptyState() {
  const { openAuthModal } = useAuthStore()

  return (
    <GuestFeatureOverlay
      badgeText="Личный словарь"
      title="Словарь доступен после входа"
      description="Авторизуйтесь, чтобы сохранять новые слова во время чтения, тренировать их с помощью интерактивных карточек и отслеживать свой прогресс."
      footerIcon={BookOpen}
      footerText="Сохраняйте слова прямо из ридера и аудио"
      onOpenAuth={openAuthModal}
    >
      {/* Панель поиска и фильтров */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <div className="h-9 sm:h-10 w-full sm:w-72 bg-muted rounded-md flex items-center px-3 gap-2">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <div className="h-3 w-32 bg-muted-foreground/30 rounded" />
        </div>

        <div className="flex gap-2">
          <div className="h-9 sm:h-10 w-full sm:w-36 bg-muted rounded-md flex items-center px-3 gap-2">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            <div className="h-3 w-20 bg-muted-foreground/30 rounded" />
          </div>
          <div className="h-9 sm:h-10 w-full sm:w-44 bg-primary/20 rounded-md" />
        </div>
      </div>

      {/* Таблица / Карточки демонстрационных слов */}
      <div className="border rounded-xl bg-card divide-y">
        {[
          { original: 'hydration', translation: 'гидратация', context: 'Client-side hydration failed...', status: 'new', lang: 'EN' },
          { original: 'architecture', translation: 'архитектура', context: 'This architecture allows clean code...', status: 'learning', lang: 'EN' },
          { original: 'vocabulary', translation: 'словарь', context: 'Build your active vocabulary step by step...', status: 'mastered', lang: 'EN' },
          { original: 'shadowing', translation: 'теневое повторение', context: 'Practice shadowing with native speakers...', status: 'learning', lang: 'EN' },
        ].map((item, idx) => (
          <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm sm:text-lg truncate">{item.original}</span>
                <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 py-0">{item.lang}</Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.translation}</p>
            </div>
            <Badge variant="secondary" className="capitalize text-[10px] sm:text-xs shrink-0">{item.status}</Badge>
          </div>
        ))}
      </div>
    </GuestFeatureOverlay>
  );
}