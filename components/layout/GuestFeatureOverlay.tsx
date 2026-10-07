'use client';

import { ReactNode } from 'react';
import { LucideIcon, Lock, LogIn, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GuestFeatureOverlayProps {
  /** Заблюренный контент заднего плана (интерфейс фичи) */
  children: ReactNode;
  /** Текст на бейдже сверху */
  badgeText: string;
  /** Заголовок карточки */
  title: string;
  /** Описание */
  description: string;
  /** Иконка для нижней подсказки */
  footerIcon: LucideIcon;
  /** Текст для нижней подсказки */
  footerText: string;
  /** Функция открытия окна авторизации */
  onOpenAuth: () => void;
  /** Кастомная минимальная высота (опционально) */
  minHeightClass?: string;
}

export function GuestFeatureOverlay({
  children,
  badgeText,
  title,
  description,
  footerIcon: FooterIcon,
  footerText,
  onOpenAuth,
  minHeightClass = 'min-h-[480px] sm:min-h-[550px]',
}: GuestFeatureOverlayProps) {
  return (
    <div className={`relative w-full ${minHeightClass} rounded-2xl overflow-hidden border bg-background/50 my-2`}>
      {/* 1. ЗАДНИЙ ФОН: Переданный заблюренный интерфейс */}
      <div 
        className="p-4 xs:p-6 sm:p-8 space-y-6 sm:space-y-8 filter blur-[3px] opacity-50 pointer-events-none select-none transition-all duration-300"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* 2. ПЕРЕДНИЙ ПЛАН: Адаптивный оверлей с карточкой */}
      <div className="absolute inset-0 z-10 flex items-start justify-center px-2 xs:p-4 pt-8 sm:pt-12 md:pt-16 bg-background/60 backdrop-blur-md overflow-y-auto">
        <Card className="max-w-md w-full p-4 xs:p-6 sm:p-8 text-center space-y-4 sm:space-y-6 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          {/* Иконка замка */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner shrink-0">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="gap-1 text-[11px] sm:text-xs px-2.5 py-0.5">
                <Sparkles className="w-3 h-3 text-primary shrink-0" />
                {badgeText}
              </Badge>
            </div>

            <h2 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-foreground leading-snug">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Кнопка входа и нижняя подсказка */}
          <div className="pt-1 sm:pt-2 space-y-2.5 sm:space-y-3">
            <Button 
              onClick={onOpenAuth} 
              className="w-full gap-2 text-sm sm:text-base font-semibold shadow-md hover:shadow-lg transition-all h-10 sm:h-11"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Войти в аккаунт
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground px-1">
              <FooterIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{footerText}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}