'use client';

import { useState } from 'react';
import { WordToken } from './WordToken';
import { fetchTranslation } from '@/lib/translate';
import { useReaderStore } from '@/store/useReaderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useVocabularyStore } from '@/store/useVocabularyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useAudioSync, Sentence } from '@/hooks/useAudioSync';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Loader2, Check, Plus, X } from 'lucide-react';

interface TextContentProps {
  sentences: Sentence[];
}

interface PhraseSelectionState {
  rawText: string;
  cleanText: string;
  sentenceText: string;
  rect: DOMRect;
}

export const TextContent = ({ sentences }: TextContentProps) => {
  const currentTime = useReaderStore((state) => state.currentTime);
  const setCurrentTime = useReaderStore((state) => state.setCurrentTime);
  const activePopoverId = useReaderStore((state) => state.activePopoverId);
  const setActivePopoverId = useReaderStore((state) => state.setActivePopoverId);
  const targetLanguage = useSettingsStore((state) => state.targetLanguage);

  const { isAuthenticated, login } = useAuthStore();
  const { addItem, hasItem } = useVocabularyStore();

  const [autoScroll, setAutoScroll] = useState(true);

  // Состояние выделенной фразы (для 2+ слов)
  const [phraseSelection, setPhraseSelection] = useState<PhraseSelectionState | null>(null);
  const [translation, setTranslation] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

  const { activeId, seekToSentence, sentenceRefs } = useAudioSync({
    sentences,
    currentTime,
    setCurrentTime,
    autoScroll,
  });

  const handleMouseUp = async () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const rawText = selection.toString().replace(/\s+/g, ' ').trim();
    if (!rawText) return;

    // Проверяем, что выделено минимум 2 слова
    const wordsCount = rawText.split(' ').length;
    if (wordsCount < 2) return;

    const cleanText = rawText.replace(/[.,!?;:()""«»]/g, '');
    if (!cleanText) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Находим текст предложения для контекста
    let sentenceText = '';
    let node: Node | null = range.startContainer;
    while (node && !node.parentElement?.dataset?.sentenceText) {
      node = node.parentNode;
    }
    if (node && node.parentElement?.dataset?.sentenceText) {
      sentenceText = node.parentElement.dataset.sentenceText;
    }

    // Закрываем открытые одиночные Popover
    setActivePopoverId('phrase-selection');

    setPhraseSelection({
      rawText,
      cleanText,
      sentenceText,
      rect,
    });

    setIsTranslating(true);
    const result = await fetchTranslation(cleanText, targetLanguage, 'ru');
    setTranslation(result);
    setIsTranslating(false);
  };

  const isPhraseSaved = phraseSelection ? hasItem(phraseSelection.cleanText) : false;

  const handleSavePhrase = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!phraseSelection) return;

    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    if (!isPhraseSaved && phraseSelection.cleanText) {
      addItem({
        original: phraseSelection.cleanText,
        translation: translation || '—',
        contextSentence: phraseSelection.sentenceText,
        sourceLang: targetLanguage,
        targetLang: 'ru',
      });
    }
  };

  const handleSentenceClick = (startTime: number) => {
    // Не запускаем аудио, если юзер просто выделял текст
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      return;
    }
    seekToSentence(startTime);
  };

  return (
    <div
      className="space-y-4 relative selection:bg-primary/30 selection:text-primary-foreground"
      onMouseUp={handleMouseUp}
    >
      {/* Шапка текстовой секции */}
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

      {/* Popover для выделенных ФРАЗ (2+ слов) */}
      {phraseSelection && activePopoverId === 'phrase-selection' && (
        <Popover
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setPhraseSelection(null);
              setActivePopoverId(null);
            }
          }}
        >
          <PopoverAnchor
            style={{
              position: 'fixed',
              left: `${phraseSelection.rect.left + phraseSelection.rect.width / 2}px`,
              top: `${phraseSelection.rect.top}px`,
              width: '1px',
              height: '1px',
              pointerEvents: 'none',
            }}
          />
          <PopoverContent className="w-64 p-3 shadow-md" side="top" align="center">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b pb-1">
                <span className="font-semibold text-sm truncate max-w-[170px]" title={phraseSelection.cleanText}>
                  {phraseSelection.cleanText}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-mono">{targetLanguage}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-foreground focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhraseSelection(null);
                      setActivePopoverId(null);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Закрыть</span>
                  </Button>
                </div>
              </div>

              <div className="text-sm min-h-[1.5rem] flex items-center">
                {isTranslating ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" /> Переводим...
                  </div>
                ) : (
                  <span className="text-foreground">{translation}</span>
                )}
              </div>

              <Button
                size="sm"
                variant={isPhraseSaved ? 'outline' : 'default'}
                className="w-full text-xs h-8 gap-1 cursor-pointer"
                disabled={isTranslating || isPhraseSaved}
                onClick={handleSavePhrase}
              >
                {isPhraseSaved ? (
                  <>
                    <Check className="h-3 w-3 text-green-500" /> В словаре
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" /> В словарь
                  </>
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* Список предложений */}
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

              <p
                data-sentence-text={sentence.text}
                className="text-base md:text-lg leading-relaxed inline-block"
              >
                {words.map((word, idx) => {
                  const tokenId = `${sentence.id}-w-${idx}`;
                  return (
                    <WordToken
                      key={tokenId}
                      tokenId={tokenId}
                      word={word}
                      fullSentence={sentence.text}
                    />
                  );
                })}
              </p>
            </div>
          );
        })}
      </div>

      {/* Диалог авторизации */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-[400px]" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Сохранение фраз</DialogTitle>
            <DialogDescription className="pt-2">
              Войдите в аккаунт, чтобы сохранять фразы и слова в личный словарь.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="ghost" onClick={() => setIsAuthDialogOpen(false)}>
              Отмена
            </Button>
            <Button
              onClick={() => {
                login();
                setIsAuthDialogOpen(false);
              }}
            >
              Войти
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};