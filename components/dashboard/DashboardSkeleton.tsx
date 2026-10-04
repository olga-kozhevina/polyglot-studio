// components/dashboard/DashboardSkeleton.tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Фиксированные высоты для столбиков скелетона графика (детерминированные значения)
const SKELETON_BAR_HEIGHTS = ['40%', '65%', '30%', '80%', '55%', '45%', '70%'];

export function DashboardSkeleton() {
  return (
    <div className="container max-w-6xl px-4 py-6 sm:py-8 space-y-8 animate-in fade-in-50 duration-300">
      {/* Шапка дашборда */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-5">
        <div className="space-y-2">
          {/* Заголовок "Панель управления" */}
          <Skeleton className="h-8 w-56 sm:w-64" />
          {/* Подзаголовок "С возвращением..." */}
          <Skeleton className="h-4 w-40 sm:w-48" />
        </div>

        {/* Бейдж текущего языка */}
        <Skeleton className="h-8 w-36 rounded-full" />
      </div>

      {/* СЕКЦИЯ 1: Прогресс по ТЕКУЩЕМУ языку */}
      <section className="space-y-4">
        <div className="space-y-1.5">
          {/* Заголовок секции */}
          <Skeleton className="h-6 w-48 sm:w-56" />
          {/* Описание */}
          <Skeleton className="h-4 w-72 sm:w-80" />
        </div>

        {/* 2 карточки: Время прослушивания и Выучено слов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6 sm:pb-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 sm:pt-0 space-y-2">
                <Skeleton className="h-8 w-24 sm:w-28" />
                <Skeleton className="h-3 w-40" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* СЕКЦИЯ 2: ОБЩАЯ активность аккаунта */}
      <section className="space-y-4 pt-4 border-t">
        <div className="space-y-1.5">
          {/* Заголовок "Общая активность" */}
          <Skeleton className="h-6 w-52" />
          {/* Подзаголовок */}
          <Skeleton className="h-4 w-64 sm:w-72" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Карточка Стрика */}
          <Card className="lg:col-span-1 flex flex-col justify-between">
            <CardHeader className="p-4 sm:p-6 pb-2 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>

          {/* Карточка Графика */}
          <Card className="lg:col-span-2">
            <CardHeader className="p-4 sm:p-6 pb-2 space-y-2">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-3 w-44" />
            </CardHeader>
            <CardContent className="p-2 sm:p-6 pt-0 space-y-4">
              {/* Скелетон графика (Recharts AreaChart) */}
              <div className="h-[200px] sm:h-[240px] w-full pt-4 flex items-end justify-between gap-2 px-2">
                {SKELETON_BAR_HEIGHTS.map((height, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-2 h-full justify-end">
                    <Skeleton
                      className="w-full rounded-t-md"
                      style={{ height }}
                    />
                    <Skeleton className="h-3 w-6 sm:w-8" />
                  </div>
                ))}
              </div>

              {/* Моб-версия для совсем маленьких экранов */}
              <div className="grid grid-cols-7 gap-1 text-center pt-3 border-t mt-2 sm:hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <Skeleton className="h-2.5 w-4" />
                    <Skeleton className="h-3 w-5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}