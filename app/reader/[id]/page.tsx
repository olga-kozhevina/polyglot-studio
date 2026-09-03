import { getFilteredTexts } from '@/lib/texts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

interface ReaderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { id } = await params;
  const materials = await getFilteredTexts({});
  const material = materials.find((m) => m.id === id);

  // Если материал с таким ID не найден — показываем 404
  if (!material) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 max-w-4xl">
      {/* Кнопка возврата в каталог */}
      <Button asChild variant="ghost" size="sm" className="gap-2">
        <Link href="/catalog">
          <ArrowLeft className="w-4 h-4" /> Назад в каталог
        </Link>
      </Button>

      {/* Шапка текста */}
      <div className="space-y-3 border-b pb-6">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{material.targetLanguage}</Badge>
          <Badge>{material.level}</Badge>
          <Badge variant="secondary">{material.category}</Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{material.title}</h1>
        <p className="text-muted-foreground">{material.description}</p>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {material.duration} сек.
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> {material.wordCount} слов
          </span>
        </div>
      </div>

      {/* Заглушка списка предложений (будущий плеер и shadowing-тренажер) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Предложения и таймкоды:</h2>
        <div className="space-y-3">
          {material.sentences.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-lg border bg-card text-card-foreground flex flex-col gap-1"
            >
              <span className="text-xs font-mono text-muted-foreground">
                [{s.startTime}s - {s.endTime}s]
              </span>
              <p className="text-base">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}