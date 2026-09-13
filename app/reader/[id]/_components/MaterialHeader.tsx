'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { WordToken } from './WordToken';
import { Clock, BookOpen, Loader2, Check, Plus, X } from 'lucide-react';
import { pluralizeWords } from '@/lib/utils';
import { fetchTranslation } from '@/lib/translate';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useReaderStore } from '@/store/useReaderStore';
import { useVocabularyStore } from '@/store/useVocabularyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface MaterialHeaderProps {
    title: string;
    description: string;
    targetLanguage: string;
    level: string;
    category: string;
    duration: number;
    wordCount: number;
}

interface PhraseSelection {
    cleanText: string;
    rect: DOMRect;
    contextSentence: string;
}

export function MaterialHeader({
    title,
    description,
    targetLanguage,
    level,
    category,
    duration,
    wordCount,
}: MaterialHeaderProps) {
    const currentLang = useSettingsStore((state) => state.targetLanguage) || targetLanguage;
    const activePopoverId = useReaderStore((state) => state.activePopoverId);
    const setActivePopoverId = useReaderStore((state) => state.setActivePopoverId);

    const { isAuthenticated, login } = useAuthStore();
    const { addItem, hasItem } = useVocabularyStore();

    const [phraseSelection, setPhraseSelection] = useState<PhraseSelection | null>(null);
    const [translation, setTranslation] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

    // Выделение фраз мышкой
    const handleMouseUp = async () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const rawText = selection.toString().replace(/\s+/g, ' ').trim();
        if (!rawText || rawText.split(' ').length < 2) return;

        const cleanText = rawText.replace(/[.,!?;:()""«»]/g, '');
        if (!cleanText) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setActivePopoverId('header-phrase-selection');
        setPhraseSelection({
            cleanText,
            rect,
            contextSentence: `${title}. ${description}`,
        });

        setIsTranslating(true);
        const res = await fetchTranslation(cleanText, currentLang, 'ru');
        setTranslation(res);
        setIsTranslating(false);
    };

    const isSaved = phraseSelection ? hasItem(phraseSelection.cleanText) : false;

    const handleSavePhrase = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!phraseSelection) return;

        if (!isAuthenticated) {
            setIsAuthDialogOpen(true);
            return;
        }

        if (!isSaved && phraseSelection.cleanText) {
            addItem({
                original: phraseSelection.cleanText,
                translation: translation || '—',
                contextSentence: phraseSelection.contextSentence,
                sourceLang: currentLang,
                targetLang: 'ru',
            });
        }
    };

    const titleWords = title.split(' ');
    const descriptionWords = description.split(' ');

    return (
        <div
            className="space-y-3 border-b pb-6 select-text selection:bg-primary/20 selection:text-foreground"
            onMouseUp={handleMouseUp}
        >
            <div className="flex items-center gap-2">
                <Badge variant="outline">{targetLanguage}</Badge>
                <Badge>{level}</Badge>
                <Badge variant="secondary">{category}</Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight leading-snug">
                {titleWords.map((word, idx) => (
                    <WordToken
                        key={`title-w-${idx}`}
                        tokenId={`header-title-w-${idx}`}
                        word={word}
                        fullSentence={title}
                        className="text-3xl font-bold"
                    />
                ))}
            </h1>

            <p className="text-muted-foreground leading-relaxed">
                {descriptionWords.map((word, idx) => (
                    <WordToken
                        key={`desc-w-${idx}`}
                        tokenId={`header-desc-w-${idx}`}
                        word={word}
                        fullSentence={description}
                        className="text-muted-foreground font-normal"
                    />
                ))}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 pb-4">
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {duration} сек.
                </span>
                <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> {pluralizeWords(wordCount)}
                </span>
            </div>

            {/* Popover для выделенных фраз в шапке */}
            {phraseSelection && activePopoverId === 'header-phrase-selection' && (
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
                    <PopoverContent className="w-64 p-3 shadow-md relative" side="top" align="center" onOpenAutoFocus={(e) => e.preventDefault()}>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between border-b pb-1">
                                <span className="font-semibold text-sm truncate max-w-[150px]" title={phraseSelection.cleanText}>
                                    {phraseSelection.cleanText}
                                </span>

                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono">{currentLang}</span>
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
}