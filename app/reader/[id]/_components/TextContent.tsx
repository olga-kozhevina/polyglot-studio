'use client';

import { useState } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { useAudioSync, Sentence } from '@/hooks/useAudioSync';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface TextContentProps {
  sentences: Sentence[];
}

export const TextContent = ({ sentences }: TextContentProps) => {
  const currentTime = useReaderStore((state) => state.currentTime);
  const setCurrentTime = useReaderStore((state) => state.setCurrentTime);
  
  // Локальное состояние авто-скролла (или можно вынести в Zustand store)
  const [autoScroll, setAutoScroll] = useState(true);

  const { activeId, seekToSentence, sentenceRefs } = useAudioSync({
    sentences,
    currentTime,
    setCurrentTime,
    autoScroll,
  });

  return (
    <div className="space-y-4">
      {/* Шапка текстовой секции и переключатель "Авто-скролл" */}
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

      {/* Список предложений с подсветкой и кликом */}
      <div className="space-y-3">
        {sentences.map((sentence) => {
          const isActive = sentence.id === activeId;

          return (
            <div
              key={sentence.id}
              ref={(el) => {
                if (el) sentenceRefs.current.set(sentence.id, el);
                else sentenceRefs.current.delete(sentence.id);
              }}
              onClick={() => seekToSentence(sentence.startTime)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none',
                'bg-card text-card-foreground hover:bg-muted/60 hover:border-muted-foreground/30',
                /* Мягкая подсветка активного предложения (Tailwind) */
                isActive &&
                  'bg-blue-500/10 border-blue-500/40 text-blue-950 dark:text-blue-100 shadow-sm ring-1 ring-blue-500/30 scale-[1.01]'
              )}
            >
              <div className="flex items-center justify-between mb-1">
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
              <p className="text-base md:text-lg leading-relaxed">{sentence.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};