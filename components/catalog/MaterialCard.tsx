import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TextMaterial } from '@/types/text';
import { Clock, BookOpen, Play } from 'lucide-react';
import { pluralizeWords } from '@/lib/utils';

interface MaterialCardProps {
  material: TextMaterial;
}

export function MaterialCard({ material }: MaterialCardProps) {
  // Форматирование секунд в минуты и секунды (например, 02:15)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Варианты цвета бейджа в зависимости от уровня
  const levelVariant = {
    B1: 'secondary',
    B2: 'default',
    C1: 'destructive',
  }[material.level] as 'secondary' | 'default' | 'destructive';

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-bold">
              {material.targetLanguage}
            </Badge>
            <Badge variant={levelVariant}>{material.level}</Badge>
          </div>
          <Badge variant="secondary" className="text-xs">
            {material.category}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 text-xl">{material.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {material.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="mt-auto pt-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDuration(material.duration)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{pluralizeWords(material.wordCount)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild className="w-full gap-2">
          <Link href={`/reader/${material.id}`}>
            <Play className="w-4 h-4 fill-current" /> Начать тренировку
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}