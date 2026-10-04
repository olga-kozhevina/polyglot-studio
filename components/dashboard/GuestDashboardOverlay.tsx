'use client';

import { Lock, Sparkles, Headphones, BookOpen, Activity, Flame, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TargetLanguage } from '@/store/useSettingsStore';

interface GuestDashboardOverlayProps {
  onOpenAuth: () => void;
  targetLanguage: TargetLanguage;
  languageLabel: string;
}

export function GuestDashboardOverlay({
  onOpenAuth,
  targetLanguage,
  languageLabel,
}: GuestDashboardOverlayProps) {
  return (
    <div className="container max-w-6xl px-4 py-6 sm:py-8 space-y-8 relative overflow-hidden">
      {/* Плавное всплывающее окно авторизации по центру */}
      <div className="absolute inset-x-4 top-12 z-20 flex justify-center">
        <div className="w-full max-w-md p-6 sm:p-8 bg-background/95 backdrop-blur-md rounded-2xl border shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-xl sm:text-2xl font-bold">
            Войдите, чтобы отслеживать свой прогресс
          </h1>

          <p className="text-muted-foreground text-xs sm:text-sm">
            Получите доступ к персональной аналитике по языкам, истории тренировок и общему стрику.
          </p>

          <Button onClick={onOpenAuth} size="lg" className="w-full shadow-md">
            Войти в аккаунт
          </Button>
        </div>
      </div>

      {/* Замыленная фоновая верстка дашборда */}
      <div className="filter blur-sm opacity-40 pointer-events-none select-none space-y-8">
        {/* Шапка */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Панель управления</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              С возвращением, <span className="font-medium text-foreground">Гость</span>!
            </p>
          </div>
          <Badge variant="outline" className="px-3 py-1.5 text-xs sm:text-sm gap-1.5 font-medium w-fit bg-background">
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            Текущий язык: <span className="text-primary font-bold uppercase">{targetLanguage}</span>
          </Badge>
        </div>

        {/* Секция 1: Прогресс */}
        <section className="space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Прогресс: {languageLabel}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Статистика наработанного материала исключительно для этого языка
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Время прослушивания</CardTitle>
                <Headphones className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary">120 мин</div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">Наслушано в ридере и аудировании</p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Выучено слов</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold text-primary">45</div>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">Словарь целевого языка</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Секция 2: Общая активность */}
        <section className="space-y-4 pt-4 border-t">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Общая активность приложения
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Занимайтесь любыми языками каждый день, чтобы поддерживать стрик
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-1 flex flex-col justify-between">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xs sm:text-sm font-medium">Общий Streak</CardTitle>
                  <Flame className="h-5 w-5 text-orange-500 fill-orange-500/20" />
                </div>
                <CardDescription className="text-xs">Засчитывает практику любого из языков</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2">
                  <span>5</span>
                  <span className="text-base sm:text-lg font-medium text-muted-foreground">дней</span>
                  <span>🔥</span>
                </div>
                <p className="text-xs text-muted-foreground">Отличный темп! Зайдите завтра, чтобы продолжить серию.</p>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="p-4 sm:p-6 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Суммарная активность (последние 7 дней)</CardTitle>
                <CardDescription className="text-xs">Всего минут прослушивания по всем языкам</CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 pt-0">
                <div className="h-[200px] sm:h-[240px] w-full pt-4 flex items-end justify-between gap-2 px-2 border-b pb-2">
                  {[30, 45, 20, 60, 40, 50, 75].map((height, i) => (
                    <div key={i} className="w-full bg-primary/20 rounded-t-md" style={{ height: `${height}%` }} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}