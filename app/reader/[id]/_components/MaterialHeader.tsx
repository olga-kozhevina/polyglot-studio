'use client';

import { Badge } from '@/components/ui/badge';
import { WordToken } from './WordToken';
import { Clock, BookOpen, Loader2, Check, Plus, X } from 'lucide-react';
import { pluralizeWords } from '@/lib/utils';
import { usePhraseSelection } from '@/hooks/usePhraseSelection';
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { GuestActionModal } from '@/components/auth/GuestActionModal';

interface MaterialHeaderProps {
    title: string;
    description: string;
    targetLanguage: string;
    level: string;
    category: string;
    duration: number;
    wordCount: number;
}

// Вспомогательный компонент для превращения текста в интерактивные слова
function RenderInteractiveText({ text, prefixId, className }: { text: string; prefixId: string; className?: string }) {
    const words = text.split(' ');
    return (
        <span className={className} data-sentence-text={text}>
            {words.map((word, idx) => (
                <span key={`${prefixId}-${idx}`}>
                    <WordToken
                        tokenId={`${prefixId}-${idx}`}
                        word={word}
                        fullSentence={text}
                        className={className}
                    />
                    {idx < words.length - 1 && ' '}
                </span>
            ))}
        </span>
    );
}

export function MaterialHeader({
    title,
    description,
    targetLanguage: targetLangProp,
    level,
    category,
    duration,
    wordCount,
}: MaterialHeaderProps) {
    // Используем общий хук выделения фраз
    const {
        phraseSelection,
        isTranslating,
        translation,
        isSaved,
        targetLanguage,
        isAuthDialogOpen,
        setIsAuthDialogOpen,
        handleMouseUp,
        handleSavePhrase,
        closePopover,
        handleOpenFullAuthModal,
    } = usePhraseSelection();

    return (
        <div
            className="space-y-3 border-b pb-6 select-text selection:bg-primary/20 selection:text-foreground relative"
            onMouseUp={() => handleMouseUp()}
        >
            {/* Метки / Теги */}
            <div className="flex items-center gap-2">
                <Badge variant="outline">{targetLangProp}</Badge>
                <Badge>{level}</Badge>
                <Badge variant="secondary">{category}</Badge>
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl font-bold tracking-tight leading-snug">
                <RenderInteractiveText text={title} prefixId="header-title" className="text-3xl font-bold" />
            </h1>

            {/* Подзаголовок / Описание */}
            <p className="text-muted-foreground leading-relaxed">
                <RenderInteractiveText text={description} prefixId="header-desc" className="text-muted-foreground font-normal" />
            </p>

            {/* Мета-информация */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 pb-4">
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {duration} сек.
                </span>
                <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> {pluralizeWords(wordCount)}
                </span>
            </div>

            {/* Popover для перевода выделенных фраз (2+ слов) */}
            {phraseSelection && (
                <Popover open={true} onOpenChange={(open) => !open && closePopover()}>
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
                                        onClick={closePopover}
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
                                variant={isSaved ? 'outline' : 'default'}
                                className="w-full text-xs h-8 gap-1 cursor-pointer"
                                disabled={isTranslating || isSaved}
                                onClick={handleSavePhrase}
                            >
                                {isSaved ? (
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

            {/* Диалог авторизации при попытке сохранить фразу неавторизованным пользователем */}
            <GuestActionModal
                isOpen={isAuthDialogOpen}
                onClose={() => setIsAuthDialogOpen(false)}
                title="Сохранение фразы"
                description="Войдите в аккаунт, чтобы сохранять готовые выражения из текста."
                cancelText="Продолжить чтение"
            />
        </div>
    );
}