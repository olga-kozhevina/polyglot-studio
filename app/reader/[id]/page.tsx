import { getFilteredTexts } from '@/lib/texts';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { AudioPlayer } from './_components/AudioPlayer';
import { ReaderClientWrapper } from './_components/ReaderClientWrapper';
import { TextContent } from './_components/TextContent';
import { MaterialHeader } from './_components/MaterialHeader';

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
    <ReaderClientWrapper
      material={{
        id: material.id,
        title: material.title,
        level: material.level,
        targetLanguage: material.targetLanguage,
      }}
    >
      <div className="container mx-auto py-2 px-4 space-y-6 max-w-4xl pb-16">
        <Button asChild variant="ghost" size="sm" className="gap-2 pl-0 px-3 border border-border/60 bg-muted/30 hover:bg-muted hover:border-border transition-all rounded-lg cursor-pointer">
          <Link href="/reader">
            <ArrowLeft className="w-4 h-4" /> В меню тренировок
          </Link>
        </Button>

        {/* Интерактивная шапка материала */}
        <MaterialHeader
          title={material.title}
          description={material.description}
          targetLanguage={material.targetLanguage}
          level={material.level}
          category={material.category}
          duration={material.duration}
          wordCount={material.wordCount}
        />

        <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-foreground">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />

          <div className="flex flex-col gap-1 leading-relaxed">
            <p>
              <strong>Техника Shadowing:</strong> Слушайте диктора и проговаривайте фразы вслух.
            </p>
            <p className="text-muted-foreground text-sm">
              Для отработки речи кликайте по тексту или используйте кнопку <strong>-5s</strong>.
            </p>
          </div>
        </div>

        {/* Интерактивный текст материала с синхронизацией и авто-скроллом */}
        <TextContent sentences={material.sentences} />

        {/* Закрепленный кастомный плеер */}
        <AudioPlayer audioUrl={material.audioUrl} />
      </div>
    </ReaderClientWrapper>
  );
}