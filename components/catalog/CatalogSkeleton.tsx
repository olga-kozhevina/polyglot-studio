'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function CatalogSkeleton() {
  return (
    <div className="space-y-6">
      {/* Поисковая строка и фильтры по уровням */}
      <div className="flex flex-col xl:flex-row gap-4 justify-between items-stretch xl:items-center">
        <Skeleton className="h-8 w-full xl:max-w-md rounded-md" />
        <Skeleton className="h-8 w-full xl:w-[360px] rounded-md" />
      </div>

      {/* Категории (чипы) */}
      <div className="flex flex-wrap items-center gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Сетка карточек-скелетонов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border p-5 space-y-3 bg-card h-[220px] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
              <Skeleton className="h-6 w-4/5 mt-2" />
              <Skeleton className="h-4 w-full" />
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-border/40 mt-auto">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}