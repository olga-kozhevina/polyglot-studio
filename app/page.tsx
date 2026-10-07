import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mic,
  Headphones,
  Sparkles,
  ArrowRight,
  Volume2,
  Globe,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-6 md:py-12 max-w-5xl mx-auto px-3 sm:px-4 overflow-x-hidden">
      {/* HERO СЕКЦИЯ */}
      <section className="flex flex-col items-center text-center space-y-6 sm:space-y-8 pt-2">
        <Badge
          variant="secondary"
          className="px-3.5 py-1.5 sm:px-5 sm:py-2 gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-medium rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs max-w-full text-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span className="truncate">Свобода практики без обязательной регистрации</span>
        </Badge>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] text-foreground break-words">
          Говорите на иностранном языке{' '}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            уверенно и бегло
          </span>
        </h1>

        <div className="flex flex-col items-center gap-3 max-w-2xl w-full">
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed px-1">
            Интерактивная платформа для полного погружения в{' '}
            <span className="text-foreground font-semibold">английский, французский и турецкий</span>{' '}
            языки с помощью техники теневого повторения (Shadowing).
          </p>

          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/60 px-3 sm:px-4 py-2 rounded-xl sm:rounded-full border border-border/60 text-center max-w-full">
            <Globe className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="leading-tight">Язык каталога переключается в шапке сайта</span>
          </div>
        </div>

        <div className="pt-2 w-full sm:w-auto">
          <Button asChild size="lg" className="gap-2 text-sm sm:text-base px-6 sm:px-9 h-12 sm:h-13 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer font-medium w-full sm:w-auto">
            <Link href="/catalog">
              <span>Перейти в каталог</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ЧТО ТАКОЕ МЕТОД SHADOWING */}
      <section className="space-y-6 sm:space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto px-1">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Как работает метод Shadowing</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">Проверенный подход для быстрой постановки естественного произношения</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="bg-card/40 border hover:border-blue-500/40 transition-colors shadow-xs flex flex-col justify-between">
            <CardHeader className="space-y-3 p-5 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <CardTitle className="text-lg sm:text-xl">1. Слушайте</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Выбирайте материалы под свой уровень и слушайте живую аудиодорожку с синхронизированным интерактивным текстом.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border hover:border-blue-500/40 transition-colors shadow-xs flex flex-col justify-between">
            <CardHeader className="space-y-3 p-5 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <CardTitle className="text-lg sm:text-xl">2. Повторяйте</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Проговаривайте фразы вслух вслед за носителем языка, точно копируя его интонационные переходы, ударения и темп.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/40 border hover:border-blue-500/40 transition-colors shadow-xs flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <CardHeader className="space-y-3 p-5 sm:p-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <CardTitle className="text-lg sm:text-xl">3. Контролируйте темп</CardTitle>
            </CardHeader>
            <CardContent className="p-5 sm:p-6 pt-0 sm:pt-0">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Замедляйте скорость воспроизведения, перематывайте сложные фрагменты на паузы и отрабатывайте трудные места.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ФИНАЛЬНЫЙ CTA */}
      <section className="relative rounded-2xl sm:rounded-3xl border bg-gradient-to-b from-blue-500/5 via-muted/30 to-muted/10 p-6 sm:p-10 md:p-12 text-center space-y-5 sm:space-y-6 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2.5 sm:space-y-3 max-w-xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Начните за пару кликов</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Готовы прокачать разговорный навык?</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed px-1">
            Никаких оплат и обязательных анкет. Откройте каталог текстов и запустите первую аудиотренировку прямо сейчас.
          </p>
        </div>

        <div className="pt-1 sm:pt-2 relative z-10 w-full sm:w-auto">
          <Button asChild size="lg" className="gap-2 text-sm sm:text-base px-6 sm:px-9 h-12 sm:h-13 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer font-medium w-full sm:w-auto">
            <Link href="/catalog" className="w-full sm:w-auto flex items-center justify-center">
              <span>Открыть каталог материалов</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}