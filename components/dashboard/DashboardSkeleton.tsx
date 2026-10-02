import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function DashboardSkeleton() {
  return (
    <div className="container py-8 space-y-6 animate-pulse">
      {/* Заголовок */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded-md" />
        <div className="h-4 w-64 bg-muted/60 rounded-md" />
      </div>

      {/* Карточки KPI (3 штуки) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 w-28 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded mb-1" />
              <div className="h-3 w-20 bg-muted/60 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Блок графика */}
      <Card>
        <CardHeader>
          <div className="h-5 w-40 bg-muted rounded" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-muted/40 rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}