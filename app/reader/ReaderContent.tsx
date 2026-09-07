'use client';

import Link from 'next/link';
import { useReaderStore } from '@/store/useReaderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  Play, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  UserPlus, 
  History, 
  Lock 
} from 'lucide-react';

export default function ReaderContent() {
  // 1. Получаем текущий активный язык из стора настроек
  const targetLanguage = useSettingsStore((state) => state.targetLanguage);

  // 2. Достаем объект всех сессий по языкам
  const lastSessionsByLang = useReaderStore((state) => state.lastSessionsByLang);

  // 3. Находим последнюю сессию для выбранного языка (если она есть)
  const lastSession = lastSessionsByLang[targetLanguage];

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-8">
      {lastSession ? (
        /* --- СЦЕНАРИЙ 1: Есть последняя тренировка для данного языка --- */
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Тренировка речи
            </h1>
            <p className="text-muted-foreground text-sm">
              Продолжите работу с текущим материалом или выберите новый в каталоге.
            </p>
          </div>

          <Card className="border-primary/40 bg-linear-to-br from-primary/5 via-background to-background">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm">
                <Sparkles className="h-4 w-4" />
                <span>Последний открытый материал</span>
              </div>
              <CardTitle className="text-xl font-bold pt-1">
                {lastSession.title}
              </CardTitle>
              <CardDescription className="text-xs">
                Уровень:{' '}
                <span className="font-semibold text-foreground uppercase">
                  {lastSession.level}
                </span>
                {lastSession.targetLanguage && (
                  <span className="ml-2 font-medium text-muted-foreground">
                    ({lastSession.targetLanguage})
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <Button asChild size="lg" className="gap-2 cursor-pointer">
                <Link href={`/reader/${lastSession.id}`}>
                  <Play className="h-4 w-4 fill-current" />
                  Продолжить тренировку
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="gap-2 cursor-pointer">
                <Link href="/catalog">
                  <BookOpen className="h-4 w-4" />
                  Выбрать другой текст
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed bg-muted/20">
            <CardContent className="p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <History className="w-5 h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">Полная история занятий</h3>
                    <Badge variant="secondary" className="text-[10px] gap-1 px-1.5 py-0 shrink-0">
                      <Lock className="w-3 h-3" /> Гость
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                    Сейчас сохраняется только последний текст для каждого языка. Войдите в личный кабинет, чтобы отслеживать прогресс по всем пройденным темам и сохранять слова.
                  </p>
                </div>
              </div>

              <Button asChild variant="default" size="sm" className="shrink-0 w-full md:w-auto gap-2 whitespace-nowrap self-stretch md:self-auto justify-center">
                <Link href="/profile">
                  <UserPlus className="w-4 h-4" />
                  Войти или зарегистрироваться
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* --- СЦЕНАРИЙ 2: EMPTY STATE (для данного языка сессий еще не было) --- */
        <div className="text-center space-y-8 py-4">
          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Headphones className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Тренажер речи и аудирования
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              У вас пока нет активных тренировок для выбранного языка ({targetLanguage}). Выберите материал в каталоге, чтобы начать практиковать теневое повторение (Shadowing).
            </p>
          </div>

          <div>
            <Button asChild size="lg" className="gap-2 cursor-pointer px-6">
              <Link href="/catalog">
                Перейти в каталог материалов
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Card className="text-left bg-muted/30 border-dashed max-w-xl mx-auto">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <span>💡</span> Как проходить тренировку?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-2">
              <p>1. Включайте аудиозапись текста на комфортной скорости.</p>
              <p>2. Повторяйте фразы с синхронными субтитрами вслед за диктором.</p>
              <p>3. Нажимайте на незнакомые слова прямо в тексте, чтобы перевести их и сохранить в личный словарь.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}