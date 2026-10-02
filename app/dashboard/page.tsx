'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { DashboardSkeleton } from '@/components/dashboard/DashboardSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, Headphones, BookOpen, Lock } from 'lucide-react';
import { useState } from 'react';
import { AuthModal } from '@/components/auth/AuthModal'; // Ваш модал входа

// Мок-данные для графиков авторизованного пользователя
const activityData = [
    { day: 'Пн', minutes: 15 },
    { day: 'Вт', minutes: 25 },
    { day: 'Ср', minutes: 10 },
    { day: 'Чт', minutes: 30 },
    { day: 'Пт', minutes: 45 },
    { day: 'Сб', minutes: 20 },
    { day: 'Вс', minutes: 40 },
];

export default function DashboardPage() {
    const { user, _hasHydrated } = useAuthStore();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    // 1. Пока стор не гидратирован из localStorage — показываем скелетон (нет фликера)
    if (!_hasHydrated) {
        return <DashboardSkeleton />;
    }

    // 2. Рендер для ГОСТЯ (Демо-режим)
    if (!user) {
        return (
            <div className="container py-8 space-y-8 relative">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-12 px-4 bg-muted/40 rounded-2xl border border-dashed relative overflow-hidden">
                    <div className="absolute inset-0 backdrop-blur-[2px] bg-background/30 pointer-events-none z-0" />

                    <div className="relative z-10 space-y-4 max-w-md">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold">Войдите, чтобы отслеживать свой прогресс и наговоренные минуты</h1>
                        <p className="text-muted-foreground text-sm">
                            Получите доступ к детальной статистике, управлению словарем методом интервальных повторений и персональной аналитике.
                        </p>
                        <Button onClick={() => setIsAuthOpen(true)} size="lg" className="w-full">
                            Войти в аккаунт
                        </Button>
                    </div>
                </div>

                {/* Размытый демо-блок для демонстрации */}
                <div className="opacity-40 pointer-events-none filter blur-xs grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card><CardHeader><CardTitle>Минут прослушано</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">120 мин</div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Выучено слов</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">45</div></CardContent></Card>
                    <Card><CardHeader><CardTitle>Серия дней (Streak)</CardTitle></CardHeader><CardContent><div className="text-3xl font-bold">5 дней 🔥</div></CardContent></Card>
                </div>

                <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            </div>
        );
    }

    // 3. Рендер для АВТОРИЗОВАННОГО пользователя
    return (
        <div className="container py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Панель управления</h1>
                <p className="text-muted-foreground">Добро пожаловать обратно, {user.name || user.email}!</p>
            </div>

            {/* Интерактивные KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Минут прослушано</CardTitle>
                        <Headphones className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">185 мин</div>
                        <p className="text-xs text-muted-foreground">+20% к прошлой неделе</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Выучено слов</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">64</div>
                        <p className="text-xs text-muted-foreground">12 слов на повторении</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Серия дней (Streak)</CardTitle>
                        <Flame className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">7 дней 🔥</div>
                        <p className="text-xs text-muted-foreground">Отличная привычка!</p>
                    </CardContent>
                </Card>
            </div>

            {/* График активности Recharts */}
            <Card>
                <CardHeader>
                    <CardTitle>Активность по дням (минуты)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))',
                                        borderRadius: 'var(--radius)'
                                    }}
                                />
                                <Area type="monotone" dataKey="minutes" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorMinutes)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}