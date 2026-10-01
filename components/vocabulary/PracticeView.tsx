'use client'

import { useState } from 'react'
import { VocabularyItem } from '@/store/useVocabularyStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RotateCw, CheckCircle2 } from 'lucide-react'

interface Props {
  items: VocabularyItem[]
  onReview: (id: string, decision: 'repeat' | 'mastered') => void
}

export function PracticeView({ items, onReview }: Props) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Функция подсветки слова в контексте (как в модалке словаря)
  const highlightWordInContext = (sentence?: string, word?: string) => {
    if (!sentence) return null
    if (!word) return sentence

    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escapedWord})`, 'gi')
    const parts = sentence.split(regex)

    return parts.map((part, i) =>
      part.toLowerCase() === word.toLowerCase() ? (
        <span key={i} className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded mx-0.5 inline-block">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  // Если массив пуст — сессия завершена
  if (!items || items.length === 0) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-bold">Отличная работа!</h3>
        <p className="text-muted-foreground text-sm">
          На текущий момент все слова из сессии пройдены. Можете добавить новые или отдохнуть!
        </p>
      </Card>
    )
  }

  const currentItem = items[0]

  const handleDecision = (decision: 'repeat' | 'mastered') => {
    setIsFlipped(false)
    onReview(currentItem.id, decision)
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Осталось слов в тренировке:</span>
        <span className="font-semibold text-foreground">{items.length}</span>
      </div>

      <div
        className="relative h-80 w-full cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full rounded-xl transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''
            }`}
        >
          {/* Лицевая сторона */}
          <Card className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden border-2 border-primary/20 bg-card">
            <div className="flex justify-between items-center">
              <Badge variant="outline">{currentItem.sourceLang}</Badge>
            </div>

            <div className="text-center space-y-3 my-auto">
              <h2 className="text-3xl font-extrabold tracking-tight">{currentItem.original}</h2>
              {/* Транскрипция для всех языков */}
              {currentItem.transcription && (
                <p className="text-sm font-mono text-muted-foreground tracking-wide">
                  [{currentItem.transcription}]
                </p>
              )}
              {currentItem.contextSentence && (
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-normal px-2">
                  &quot;{highlightWordInContext(currentItem.contextSentence, currentItem.original)}&quot;
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground/90 border-t border-border/50 pt-3">
              <RotateCw className="w-4 h-4 text-primary animate-pulse" />
              <span>Нажмите, чтобы увидеть перевод</span>
            </div>
          </Card>
          {/* Обратная сторона */}
          <Card className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-emerald-500/30 bg-card">
            <div className="flex justify-between items-center">
              <Badge variant="secondary">Перевод</Badge>
            </div>

            <div className="text-center space-y-3 my-auto">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {currentItem.translation}
              </h3>
              {currentItem.contextSentence && (
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-normal px-2">
                  &quot;{highlightWordInContext(currentItem.contextSentence, currentItem.original)}&quot;
                </p>
              )}
            </div>

            {/* Пустой блок для сохранения симметрии карточки */}
            <div />
          </Card>
        </div>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="w-full flex flex-col gap-0.5 py-6 border-amber-500/50 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 cursor-pointer"
            onClick={() => handleDecision('repeat')}
          >
            <span className="font-bold">Повторить позже</span>
          </Button>

          <Button
            variant="default"
            className="w-full flex flex-col gap-0.5 py-6 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            onClick={() => handleDecision('mastered')}
          >
            <span className="font-bold">Знаю</span>
          </Button>
        </div>
      )}
    </div>
  )
}