import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroTitle } from '@/components/home/HeroTitle';
import {
  Mic,
  Headphones,
  Sparkles,
  ArrowRight,
  BookOpen,
  BarChart3,
  Volume2,
  BrainCircuit,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-14 py-6 md:py-10 max-w-5xl mx-auto px-4">
      <section className="flex flex-col items-center text-center space-y-6 pt-4">
        <Badge
          variant="secondary"
          className="px-4 py-1.5 sm:px-5 sm:py-2 gap-2 text-xs sm:text-sm font-medium rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          Платформа для практики иностранных языков
        </Badge>

        <HeroTitle />

        <div className="flex flex-col gap-1.5 max-w-2xl text-base sm:text-lg leading-relaxed border-l-2 border-blue-500 pl-4 text-left">
          <p className="text-foreground font-medium">
            Polyglot Studio помогает преодолеть языковой барьер с помощью техники теневого повторения (Метод Shadowing).
          </p>
          <p className="text-muted-foreground">
            Отрабатывайте произношение в реальном времени и запоминайте новые слова.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/catalog">
            <Button size="lg" className="gap-2 text-sm md:text-base px-8 h-12 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer">
              Перейти в каталог <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ЧТО ТАКОЕ МЕТОД SHADOWING */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Как работает метод Shadowing</h2>
          <p className="text-muted-foreground text-sm">Три шага к естественному произношению</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card/50 border shadow-2xs">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Headphones className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">1. Слушайте</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Выбирайте материалы своего уровня и слушайте качественную аудиодорожку с точно синхронизированным текстом.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border shadow-2xs">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Mic className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">2. Повторяйте</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Проговаривайте фразы вслух вслед за диктором, имитируя его интонацию, ударения и темп речи.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border shadow-2xs sm:col-span-2 lg:col-span-1">
            <CardHeader>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                <Volume2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg">3. Управляйте темпом</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Замедляйте или ускоряйте аудио, перематывайте сложные фрагменты на -5s и отрабатывайте трудные предложения.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ТИЗЕР ЛИЧНОГО КАБИНЕТА */}
      <section className="rounded-2xl border bg-muted/30 p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold">Личный кабинет и Прогресс</h2>
              <Badge variant="outline" className="text-xs bg-background">Скоро</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              В следующих обновлениях появится полноценная экосистема для сохранения знаний.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-background border shadow-2xs">
            <BookOpen className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Персональный словарь</h3>
              <p className="text-xs text-muted-foreground mt-1">Сохранение незнакомых слов в один клик из текста тренировки.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-background border shadow-2xs">
            <BrainCircuit className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Интервальные повторения</h3>
              <p className="text-xs text-muted-foreground mt-1">Умные карточки (SRS) для эффективного запоминания лексики.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-background border shadow-2xs sm:col-span-2 lg:col-span-1">
            <BarChart3 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold">Статистика занятий</h3>
              <p className="text-xs text-muted-foreground mt-1">Отслеживание наработанных часов, прослушанных слов и серии дней (Streak).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ CTA */}
      <section className="text-center space-y-4 py-6 border-t">
        <h2 className="text-2xl font-bold">Готовы начать первую тренировку?</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Выберите подходящий материал в каталоге и заговорите на английском, французском или турецком уже сегодня.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link href="/catalog">
            Открыть Каталог
          </Link>
        </Button>
      </section>

    </div>
  );
}