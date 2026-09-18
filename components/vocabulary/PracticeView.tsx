'use client'

import { useState } from 'react'
import { VocabularyItem } from '@/store/useVocabularyStore'
import { LanguageCode } from '@/types/vocabulary'
import { speakWord } from '@/lib/spaced-repetition'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Volume2, RotateCw, CheckCircle2 } from 'lucide-react'

interface Props {
  items: VocabularyItem[]
  onReview: (id: string, grade: 'again' | 'hard' | 'easy') => void
}

export function PracticeView({ items, onReview }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="text-xl font-bold">Отличная работа!</h3>
        <p className="text-muted-foreground text-sm">
          На сегодня нет карточек для повторения. Все слова усвоены или еще не пришел срок повтора.
        </p>
      </Card>
    )
  }

  const currentItem = items[currentIndex] || items[0]
  const progressPercent = Math.round(((currentIndex) / items.length) * 100)

  const handleGrade = (grade: 'again' | 'hard' | 'easy') => {
    setIsFlipped(false)
    onReview(currentItem.id, grade)
    if (currentIndex < items.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const maskedContext = currentItem.contextSentence
    ? currentItem.contextSentence.replace(
        new RegExp(currentItem.original, 'gi'),
        '_______'
      )
    : null

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Прогресс тренировки</span>
          <span>{currentIndex + 1} из {items.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <div
        className="relative h-80 w-full cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full rounded-xl transition-all duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front Card */}
          <Card className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden border-2 border-primary/20 bg-card">
            <div className="flex justify-between items-center">
              <Badge variant="outline">{currentItem.sourceLang}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  speakWord(currentItem.original, currentItem.sourceLang as LanguageCode)
                }}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center space-y-4 my-auto">
              <h2 className="text-3xl font-extrabold tracking-tight">{currentItem.original}</h2>
              {maskedContext && (
                <p className="text-sm text-muted-foreground italic px-4">
                  &quot;{maskedContext}&quot;
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <RotateCw className="w-3 h-3" /> Нажмите, чтобы перевернуть
            </div>
          </Card>

          {/* Back Card */}
          <Card className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-emerald-500/30 bg-card">
            <div className="flex justify-between items-center">
              <Badge variant="secondary">Перевод</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  speakWord(currentItem.original, currentItem.sourceLang as LanguageCode)
                }}
              >
                <Volume2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="text-center space-y-3 my-auto">
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {currentItem.translation}
              </h3>
              {currentItem.contextSentence && (
                <p className="text-xs text-muted-foreground italic px-2">
                  &quot;{currentItem.contextSentence}&quot;
                </p>
              )}
            </div>

            <div className="text-xs text-center text-muted-foreground">
              Выберите оценку ниже
            </div>
          </Card>
        </div>
      </div>

      {isFlipped && (
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="destructive"
            className="w-full flex flex-col gap-0.5 py-6"
            onClick={() => handleGrade('again')}
          >
            <span className="font-bold">Забыл</span>
            <span className="text-[10px] opacity-80">&lt; 1 мин</span>
          </Button>
          <Button
            variant="secondary"
            className="w-full flex flex-col gap-0.5 py-6 border-amber-500/50 hover:bg-amber-500/10"
            onClick={() => handleGrade('hard')}
          >
            <span className="font-bold text-amber-600 dark:text-amber-400">Трудно</span>
            <span className="text-[10px] opacity-80">1 день</span>
          </Button>
          <Button
            variant="default"
            className="w-full flex flex-col gap-0.5 py-6 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => handleGrade('easy')}
          >
            <span className="font-bold">Легко</span>
            <span className="text-[10px] opacity-80">3-7 дней</span>
          </Button>
        </div>
      )}
    </div>
  )
}