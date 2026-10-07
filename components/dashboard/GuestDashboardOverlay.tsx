'use client';

import { Sparkles, Headphones, BookOpen, Activity, Globe2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TargetLanguage } from '@/store/useSettingsStore';
import { GuestFeatureOverlay } from '../layout/GuestFeatureOverlay'

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
    <GuestFeatureOverlay
      badgeText="Прогресс и аналитика"
      title="Войдите, чтобы отслеживать прогресс"
      description="Получите доступ к персональной аналитике по языкам, истории тренировок и общему стрику."
      footerIcon={Activity}
      footerText="Сохраняйте стрик и историю занятий"
      onOpenAuth={onOpenAuth}
    >
        {/* Шапка */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 sm:pb-5">
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Панель управления</h1>
            <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
              С возвращением, <span className="font-medium text-foreground">Гость</span>!
            </p>
          </div>

          <Badge variant="outline" className="px-2.5 py-1 text-xs sm:text-sm gap-1.5 font-medium w-fit bg-background">
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            Язык: <span className="text-primary font-bold uppercase">{targetLanguage}</span>
          </Badge>
        </div>

        {/* Секция 1: Прогресс */}
        <section className="space-y-3 sm:space-y-4">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Прогресс: {languageLabel}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Время прослушивания</CardTitle>
                <Headphones className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-3xl font-bold text-primary">120 мин</div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-6 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium">Выучено слов</CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 sm:pt-0">
                <div className="text-xl sm:text-3xl font-bold text-primary">45</div>
              </CardContent>
            </Card>
          </div>
        </section>
      </GuestFeatureOverlay>
  );
}