'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchTranslation, TranslationResult } from '@/lib/translate';
import { useVocabularyStore } from '@/store/useVocabularyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useReaderStore } from '@/store/useReaderStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { Check, Plus, Loader2, X } from 'lucide-react';

interface WordTokenProps {
    tokenId: string;
    word: string;
    fullSentence: string;
    className?: string;
}

export function WordToken({ tokenId, word, fullSentence }: WordTokenProps) {
    const targetLanguage = useSettingsStore((state) => state.targetLanguage);
    const activePopoverId = useReaderStore((state) => state.activePopoverId);
    const setActivePopoverId = useReaderStore((state) => state.setActivePopoverId);

    const [translationData, setTranslationData] = useState<TranslationResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    // const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

    const cleanWord = word.replace(/[.,!?;:()""«»]/g, '');
    const { isAuthenticated, openAuthModal } = useAuthStore();
    const { addItem, hasItem } = useVocabularyStore();

    const isOpen = activePopoverId === tokenId;
    // Если пользователь залогинен, проверяем наличие слова в сторе
    const isSaved = isAuthenticated ? hasItem(cleanWord) : false;

    const handleOpenChange = async (open: boolean) => {
        // Если пользователь выделяет несколько слов — игнорируем одиночный Popover
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 1 && selection.toString().trim().includes(' ')) {
            return;
        }

        if (open) {
            setActivePopoverId(tokenId);
            if (!translationData && cleanWord) {
                setLoading(true);
                const res = await fetchTranslation(cleanWord, targetLanguage, 'ru');
                setTranslationData(res);
                setLoading(false);
            }
        } else {
            if (isOpen) setActivePopoverId(null);
        }
    };

    const handleSaveWord = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            openAuthModal();
            return;
        }

        if (!isSaved && cleanWord) {
            addItem({
                original: cleanWord,
                translation: translationData?.translation || '—',
                transcription: translationData?.transcription,
                contextSentence: fullSentence,
                sourceLang: targetLanguage,
                targetLang: 'ru',
            });
        }
    };

    return (
        <>
            <Popover open={isOpen} onOpenChange={handleOpenChange}>
                <PopoverTrigger asChild>
                    <span
                        onClick={(e) => {
                            // ВАЖНО: Останавливаем всплытие, чтобы клик по слову НЕ запускал аудио у предложения
                            e.stopPropagation();
                        }}
                        className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors inline font-medium"
                    >
                        {word}
                    </span>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 shadow-md" side="top" align="center">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between border-b pb-1">
                            <span className="font-semibold text-sm truncate max-w-[150px]" title={cleanWord}>
                                {cleanWord}
                            </span>

                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-muted-foreground uppercase font-mono">
                                    {targetLanguage}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 rounded-full p-0 text-muted-foreground hover:text-foreground focus:outline-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActivePopoverId(null);
                                    }}
                                >
                                    <X className="h-3.5 w-3.5" />
                                    <span className="sr-only">Закрыть</span>
                                </Button>
                            </div>
                        </div>

                        <div className="text-sm min-h-[1.5rem] flex items-center">
                            {loading ? (
                                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Переводим...
                                </div>
                            ) : (
                                <span className="text-foreground">{translationData?.translation || '—'}</span>
                            )}
                        </div>

                        <Button
                            size="sm"
                            variant={isSaved ? 'outline' : 'default'}
                            className="w-full text-xs h-8 gap-1 cursor-pointer"
                            disabled={loading || isSaved}
                            onClick={handleSaveWord}
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
            {' '}

            {/* <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
                <DialogContent className="sm:max-w-[400px]" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Сохранение слов</DialogTitle>
                        <DialogDescription className="pt-2">
                            Войдите в аккаунт, чтобы сохранять слова в личный словарь.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0 mt-4">
                        <Button variant="ghost" onClick={() => setIsAuthDialogOpen(false)}>
                            Отмена
                        </Button>
                        <Button
                            onClick={() => {
                                login('user@example.com');
                                setIsAuthDialogOpen(false);
                            }}
                        >
                            Войти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog> */}
        </>
    );
}