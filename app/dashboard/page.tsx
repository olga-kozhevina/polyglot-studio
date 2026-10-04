'use client';

import { useState, useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatsStore } from '@/store/useStatsStore';
import { useSettingsStore, TargetLanguage } from '@/store/useSettingsStore';

import { GuestDashboardOverlay } from '@/components/dashboard/GuestDashboardOverlay'
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { AuthModal } from '@/components/auth/AuthModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Headphones, BookOpen, Globe2, Sparkles, Activity } from 'lucide-react';

// Утилита форматирования времени
const formatTime = (totalSeconds: number) => {
    if (!totalSeconds || totalSeconds <= 0) return '0 мин';
    if (totalSeconds < 60) return `${Math.floor(totalSeconds)} сек`;
    const minutes = totalSeconds / 60;
    return `${Number(minutes.toFixed(1))} мин`;
};

// Утилита генерации данных активности за последние 7 дней
const generateLast7DaysChartData = (activityHistory: { date: string; seconds: number }[] = []) => {
    const historyMap = new Map(activityHistory.map((h) => [h.date, h.seconds]));
    const data = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        // Используем ISO дату для надежного сопоставления YYYY-MM-DD
        const dateStr = d.toISOString().split('T')[0];
        const dayOfWeek = d.toLocaleDateString('ru-RU', { weekday: 'short' });

        const seconds = historyMap.get(dateStr) || 0;
        const minutes = Number((seconds / 60).toFixed(1));

        data.push({
            day: dayOfWeek,
            minutes: minutes,
            fullDate: dateStr,
        });
    }

    return data;
};

// Лейблы для языков
const LANGUAGE_LABELS: Record<TargetLanguage, string> = {
    EN: 'Английский (EN)',
    FR: 'Французский (FR)',
    TR: 'Турецкий (TR)',
};

export default function DashboardPage() {
    const { user, _hasHydrated: authHydrated } = useAuthStore();
    const { _hasHydrated: statsHydrated, getCurrentUserStats } = useStatsStore();
    const { targetLanguage, _hasHydrated: settingsHydrated } = useSettingsStore();
    const currentLangName = LANGUAGE_LABELS[targetLanguage] || targetLanguage;

    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const isFullyHydrated = authHydrated && statsHydrated && settingsHydrated;
    const userStats = getCurrentUserStats();

    // Вычисляем график общей активности
    const chartData = useMemo(() => {
        if (!userStats) return [];
        return generateLast7DaysChartData(userStats.activityHistory);
    }, [userStats?.activityHistory]);

    if (!isFullyHydrated) {
        return <DashboardSkeleton />;
    }

    // Заглушка для гостя
    if (!user) {
        return (
            <>
                <GuestDashboardOverlay
                    onOpenAuth={() => setIsAuthOpen(true)}
                    targetLanguage={targetLanguage}
                    languageLabel={currentLangName}
                />
                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            </>
        );
    }
    // Данные текущего языка
    const currentLangStats = userStats?.languages?.[targetLanguage as TargetLanguage] || {
        secondsListened: 0,
        wordsLearned: 0,
    };

    const streak = userStats?.streak || 0;

    return (
        <div className="container max-w-6xl px-4 py-6 sm:py-8 space-y-8">
            {/* Шапка дашборда */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Панель управления</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                        С возвращением, <span className="font-medium text-foreground">{user.name || user.email}</span>!
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1.5 text-xs sm:text-sm gap-1.5 font-medium bg-background shadow-xs">
                        <Globe2 className="w-3.5 h-3.5 text-primary" />
                        Текущий язык: <span className="text-primary font-bold uppercase">{targetLanguage}</span>
                    </Badge>
                </div>
            </div>

            {/* СЕКЦИЯ 1: Прогресс по ТЕКУЩЕМУ языку */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            Прогресс: {currentLangName}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Статистика наработанного материала исключительно для этого языка
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">
                                Время прослушивания ({targetLanguage?.toUpperCase()})
                            </CardTitle>
                            <Headphones className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 sm:pt-0">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">
                                {formatTime(currentLangStats.secondsListened)}
                            </div>
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                                Наслушано в ридере и аудировании
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">
                                Выучено слов ({targetLanguage?.toUpperCase()})
                            </CardTitle>
                            <BookOpen className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 sm:pt-0">
                            <div className="text-2xl sm:text-3xl font-bold text-primary">
                                {currentLangStats.wordsLearned}
                            </div>
                            <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                                Словарь целевого языка
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* СЕКЦИЯ 2: ОБЩАЯ активность аккаунта (Все языки) */}
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
                    {/* Серия дней (Стрик) */}
                    <Card className="lg:col-span-1 flex flex-col justify-between">
                        <CardHeader className="p-4 sm:p-6 pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xs sm:text-sm font-medium">Общий Streak</CardTitle>
                                <Flame className={`h-5 w-5 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-muted-foreground'}`} />
                            </div>
                            <CardDescription className="text-xs">
                                Засчитывает практику любого из языков
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
                            <div className="text-3xl sm:text-4xl font-extrabold flex items-center gap-2">
                                <span>{streak}</span>
                                <span className="text-base sm:text-lg font-medium text-muted-foreground">
                                    {streak === 1 ? 'день' : streak > 1 && streak < 5 ? 'дня' : 'дней'}
                                </span>
                                {streak > 0 && <span className="animate-pulse">🔥</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {streak > 0
                                    ? 'Отличный темп! Зайдите завтра, чтобы продолжить серию.'
                                    : 'Завершите занятие сегодня, чтобы запустить ударный режим!'}
                            </p>
                        </CardContent>
                    </Card>

                    {/* График суммарного времени за 7 дней */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="p-4 sm:p-6 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Суммарная активность (последние 7 дней)</CardTitle>
                            <CardDescription className="text-xs">
                                Всего минут прослушивания по всем языкам
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-2 sm:p-6 pt-0">
                            <div className="h-[200px] sm:h-[240px] w-full pt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="day"
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="hsl(var(--muted-foreground))"
                                            fontSize={11}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => `${val}m`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [`${value} мин`, 'Слушал']}
                                            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate ?? ''}
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="minutes"
                                            name="Слушал"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorMinutes)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Моб-версия списка для маленьких экранов */}
                            <div className="grid grid-cols-7 gap-1 text-center pt-3 border-t mt-2 sm:hidden">
                                {chartData.map((d, i) => (
                                    <div key={i} className="flex flex-col items-center">
                                        <span className="text-[10px] text-muted-foreground">{d.day}</span>
                                        <span className={`text-[11px] font-semibold ${d.minutes > 0 ? 'text-primary' : 'text-muted-foreground/40'}`}>
                                            {d.minutes > 0 ? `${d.minutes}m` : '-'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
}