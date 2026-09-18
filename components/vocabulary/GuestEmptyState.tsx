'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock, LogIn } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export function GuestEmptyState() {
  const { openAuthModal } = useAuthStore()

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-6">
      {/* Главный Баннер-Заглушка */}
      <Card className="p-8 text-center space-y-4 border-dashed border-2 bg-muted/30">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-2xl font-bold">Словарь доступен после входа</h2>
          <p className="text-sm text-muted-foreground">
            Авторизуйтесь, чтобы сохранять новые слова во время чтения текстов, тренировать их с помощью карточек и отслеживать свой прогресс.
          </p>
        </div>
        <Button onClick={openAuthModal} size="lg" className="gap-2">
          <LogIn className="w-4 h-4" /> Войти в аккаунт
        </Button>
      </Card>

      {/* Демонстрационный режим */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Демонстрационный режим</Badge>
          <span className="text-xs text-muted-foreground">Пример того, как выглядит ваш словарь:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75 pointer-events-none select-none">
          <Card className="p-4 space-y-2 border">
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">hydration</span>
              <Badge variant="outline">EN</Badge>
            </div>
            <p className="text-sm text-muted-foreground">гидратация</p>
            <p className="text-xs text-muted-foreground italic">&quot;Client-side hydration failed...&quot;</p>
          </Card>
          <Card className="p-4 space-y-2 border">
            <div className="flex justify-between items-start">
              <span className="font-bold text-lg">architecture</span>
              <Badge variant="outline">EN</Badge>
            </div>
            <p className="text-sm text-muted-foreground">архитектура</p>
            <p className="text-xs text-muted-foreground italic">&quot;This architecture allows clean code...&quot;</p>
          </Card>
        </div>
      </div>
    </div>
  )
}