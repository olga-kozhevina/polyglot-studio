'use client';

import { useReaderStore } from '@/store/useReaderStore';
import { cn } from '@/lib/utils';

interface Sentence {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
}

interface TextContentProps {
  sentences: Sentence[];
}

export const TextContent = ({ sentences }: TextContentProps) => {
  const currentTime = useReaderStore((state) => state.currentTime);
  const setCurrentTime = useReaderStore((state) => state.setCurrentTime);

  // Вычисляем индекс предложения, которое звучит прямо сейчас
  const activeIndex = sentences.findIndex(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );

  // При клике на предложение перематываем плеер на его startTime
  const handleSentenceClick = (startTime: number) => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElement.currentTime = startTime;
      setCurrentTime(startTime);
    }
  };

  return (
    <div className="space-y-3">
      {sentences.map((sentence, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={sentence.id}
            onClick={() => handleSentenceClick(sentence.startTime)}
            className={cn(
              'p-4 rounded-xl border transition-all duration-200 cursor-pointer select-none',
              'bg-card text-card-foreground hover:bg-muted/60 hover:border-muted-foreground/30',
              isActive &&
                'bg-blue-500/10 border-blue-500/40 text-blue-900 dark:text-blue-100 shadow-sm ring-1 ring-blue-500/30 scale-[1.01]'
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
  );
};