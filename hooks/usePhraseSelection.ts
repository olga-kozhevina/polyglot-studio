import { useState } from 'react';
import { fetchTranslation } from '@/lib/translate';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useVocabularyStore } from '@/store/useVocabularyStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useReaderStore } from '@/store/useReaderStore';

export interface PhraseSelection {
    cleanText: string;
    rect: DOMRect;
    contextSentence: string;
}

export function usePhraseSelection() {
    const targetLanguage = useSettingsStore((state) => state.targetLanguage);
    const { activePopoverId, setActivePopoverId } = useReaderStore();
    const { isAuthenticated, openAuthModal } = useAuthStore();
    const { addItem, hasItem } = useVocabularyStore();

    const [phraseSelection, setPhraseSelection] = useState<PhraseSelection | null>(null);
    const [translation, setTranslation] = useState<string>('');
    const [isTranslating, setIsTranslating] = useState<boolean>(false);
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState<boolean>(false);

    const handleMouseUp = async (fallbackContext?: string) => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;

        const rawText = selection.toString().replace(/\s+/g, ' ').trim();
        if (!rawText || rawText.split(' ').length < 2) return;

        const cleanText = rawText.replace(/^[.,!?;:()""«»“”'—]+|[.,!?;:()""«»“”'—]+$/g, '').trim();
        if (!cleanText) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Поиск предложения для контекста через data-sentence-text
        let sentenceText = '';
        let node: Node | null = range.startContainer;
        while (node && !node.parentElement?.dataset?.sentenceText) {
            node = node.parentNode;
        }
        if (node && node.parentElement?.dataset?.sentenceText) {
            sentenceText = node.parentElement.dataset.sentenceText;
        }

        setActivePopoverId('phrase-selection');
        setPhraseSelection({
            cleanText,
            rect,
            contextSentence: sentenceText || fallbackContext || cleanText,
        });

        setIsTranslating(true);
        try {
            const res = await fetchTranslation(cleanText, targetLanguage, 'ru');
            setTranslation(res);
        } catch {
            setTranslation('Ошибка перевода');
        } finally {
            setIsTranslating(false);
        }
    };

    const isSaved = phraseSelection ? hasItem(phraseSelection.cleanText) : false;

    const handleSavePhrase = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!phraseSelection) return;

        if (!isAuthenticated) {
            setIsAuthDialogOpen(true);
            return;
        }

        if (!isSaved) {
            addItem({
                original: phraseSelection.cleanText,
                translation: translation || '—',
                contextSentence: phraseSelection.contextSentence,
                sourceLang: targetLanguage,
                targetLang: 'ru',
            });
        }
    };

    const closePopover = () => {
        setPhraseSelection(null);
        setActivePopoverId(null);
    };

    const handleOpenFullAuthModal = () => {
        setIsAuthDialogOpen(false);
        if (openAuthModal) openAuthModal();
    };

    return {
        phraseSelection: activePopoverId === 'phrase-selection' ? phraseSelection : null,
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
    };
}