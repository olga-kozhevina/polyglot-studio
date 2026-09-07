'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Импортируем компонент БЕЗ SSR
const ReaderContent = dynamic(() => import('@/app/reader/ReaderContent'), {
  ssr: false,
  loading: () => (
    <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <Skeleton className="h-44 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  ),
});

export default function ReaderPage() {
  return <ReaderContent />;
}