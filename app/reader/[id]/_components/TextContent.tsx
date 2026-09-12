'use client';

import { useState } from 'react';
import { WordToken } from './WordToken';
import { fetchTranslation } from '@/lib/translate';
import { useReaderStore } from '@/store/useReaderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useAudioSync, Sentence } from '@/hooks/useAudioSync';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Loader2, X } from 'lucide-react';

interface TextContentProps {
  sentences: Sentence[];
}

export const TextContent = ({ sentences }: TextContentProps) => {
  const currentTime = useReaderStore((state) => state.currentTime);
  const setCurrentTime = useReaderStore((state) => state.setCurrentTime);

  const targetLanguage = useSettingsStore((state) => state.targetLanguage);

  // Локальное состояние авто-скролла
  const [autoScroll, setAutoScroll] = useState(true);

  // Состояние для выделения и перевода фраз
  const [selectedPhrase, setSelectedPhrase] = useState<string>('');
  const [phraseTranslation, setPhraseTranslation] = useState<string>('');
  const [isTranslatingPhrase, setIsTranslatingPhrase] = useState<boolean>(false);

  const { activeId, seekToSentence, sentenceRefs } = useAudioSync({
    sentences,
    currentTime,
    setCurrentTime,
    autoScroll,
  });

  // Перевод выделенного текста (фразы) при отпускании мыши
  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    // Переводим только если выделена фраза (содержит пробел между словами)
    if (text && text.length > 1 && text.includes(' ')) {
      setSelectedPhrase(text);
      setIsTranslatingPhrase(true);
      const translation = await fetchTranslation(text, targetLanguage, 'RU');
      setPhraseTranslation(translation);
      setIsTranslatingPhrase(false);
    }
  };

  // Клик по предложению с проверкой на отсутствие выделения
  const handleSentenceClick = (startTime: number) => {
    const selection = window.getSelection();
    // Если пользователь выделял текст (есть выделенные символы), игнорируем переход аудио
    if (selection && selection.toString().trim().length > 0) {
      return;
    }
    seekToSentence(startTime);
  };

  return (
    <div className="space-y-4 relative"
      onMouseUp={handleTextSelection} 
    >
      {/* Шапка текстовой секции и переключатель "Автопрокрутка" */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-semibold">Текст материала:</h2>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 bg-muted/40 border border-border/50 px-3 py-1.5 rounded-lg cursor-pointer transition-colors hover:bg-muted/70">
                <Switch
                  id="auto-scroll"
                  checked={autoScroll}
                  onCheckedChange={setAutoScroll}
                />
                <Label
                  htmlFor="auto-scroll"
                  className="text-xs font-medium cursor-pointer select-none"
                >
                  Автопрокрутка
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[220px] text-center text-xs">
              Автоматически удерживает звучащее предложение в центре экрана
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Всплывающая плашка с переводом выделенной ФРАЗЫ */}
      {selectedPhrase && (
        <Card className="p-3 bg-card/95 backdrop-blur border shadow-lg flex items-center justify-between gap-4 sticky top-4 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-sm">
            <span className="font-semibold text-muted-foreground">Фраза: </span>
            <span className="font-medium">&ldquo;{selectedPhrase}&rdquo;</span>
            <span className="mx-2 text-muted-foreground">—</span>
            {isTranslatingPhrase ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin text-primary" /> Перевод...
              </span>
            ) : (
              <span className="text-primary font-semibold">{phraseTranslation}</span>
            )}
          </div>
          <button
            onClick={() => setSelectedPhrase('')}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </Card>
      )}

      {/* Список предложений с подсветкой и кликом */}
      <div className="space-y-3">
        {sentences.map((sentence) => {
          const isActive = sentence.id === activeId;
          const words = sentence.text.split(' ');

          return (
            <div
              key={sentence.id}
              ref={(el) => {
                if (el) sentenceRefs.current.set(sentence.id, el);
                else sentenceRefs.current.delete(sentence.id);
              }}
              onClick={() => handleSentenceClick(sentence.startTime)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 cursor-pointer',
                'bg-card text-card-foreground hover:bg-muted/60 hover:border-muted-foreground/30',
                isActive &&
                  'bg-blue-500/10 border-blue-500/40 text-blue-950 dark:text-blue-100 shadow-sm ring-1 ring-blue-500/30 scale-[1.01]'
              )}
            >
              <div className="flex items-center justify-between mb-1.5 select-none">
                <span
                  className={cn(
                    'text-[10px] font-mono rounded px-1.5 py-0.5',
                    isActive
                      ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {sentence.startTime.toFixed(1)}s — {sentence.endTime.toFixed(1)}s
                </span>
              </div>

              {/* Рендеринг каждого слова с вызовом Popover по клику */}
              <p className="text-base md:text-lg leading-relaxed flex flex-wrap gap-x-1 gap-y-0.5">
                {words.map((word, idx) => (
                  <WordToken
                    key={`${sentence.id}-w-${idx}`}
                    word={word}
                    sourceLang={targetLanguage}
                    fullSentence={sentence.text}
                  />
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};