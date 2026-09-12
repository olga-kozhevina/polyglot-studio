'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { fetchTranslation } from '@/lib/translate';
import { useVocabularyStore } from '@/store/useVocabularyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Check, Plus, Loader2 } from 'lucide-react';

interface WordTokenProps {
    word: string;
    sourceLang: string;
    fullSentence: string;
}

export function WordToken({ word, sourceLang, fullSentence }: WordTokenProps) {
    const [translation, setTranslation] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

    const cleanWord = word.replace(/[.,!?;:()""«»]/g, '');
    const { isAuthenticated, login } = useAuthStore();
    const { addItem, hasItem } = useVocabularyStore();

    const isSaved = hasItem(cleanWord);

    const handleOpenPopover = async (open: boolean) => {
        // Если пользователь выделяет текст мышкой — не открываем окно отдельного слова
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            return;
        }
        if (open && !translation && cleanWord) {
            setLoading(true);
            const res = await fetchTranslation(cleanWord, sourceLang, 'ru');
            setTranslation(res);
            setLoading(false);
        }
    };

    const handleSaveWord = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            setIsAuthDialogOpen(true);
            return;
        }

        if (!isSaved && cleanWord) {
            addItem({
                original: cleanWord,
                translation: translation || '—',
                contextSentence: fullSentence,
                sourceLang,
                targetLang: 'ru',
            });
        }
    };

    return (
        <>
            <Popover onOpenChange={handleOpenPopover}>
                <PopoverTrigger asChild>
                    <span onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer hover:bg-primary/20 hover:text-primary rounded px-0.5 transition-colors">
                        {word}{' '}
                    </span>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 shadow-md" side="top">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between border-b pb-1">
                            <span className="font-semibold text-sm">{cleanWord}</span>
                            <span className="text-xs text-muted-foreground uppercase">{sourceLang}</span>
                        </div>

                        <div className="text-sm min-h-[1.5rem] flex items-center">
                            {loading ? (
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
                            className="w-full text-xs h-8 gap-1"
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

            {/* Диалог авторизации для Гостя */}
            <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
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
                                login(); // Симуляция входа
                                setIsAuthDialogOpen(false);
                            }}
                        >
                            Войти
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}