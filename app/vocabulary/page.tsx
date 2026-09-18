'use client'

import { useVocabularyStore, VocabularyItem } from '@/store/useVocabularyStore'
import { useAuthStore } from '@/store/useAuthStore'
import { GuestEmptyState } from '@/components/vocabulary/GuestEmptyState'
import { VocabularyTable } from '@/components/vocabulary/VocabularyTable'
import { PracticeView } from '@/components/vocabulary/PracticeView'
import { AddWordDialog } from '@/components/vocabulary/AddWordDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, BrainCircuit } from 'lucide-react'

export default function VocabularyPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const items = useVocabularyStore((s) => s.items)
  const addItem = useVocabularyStore((s) => s.addItem)
  const removeItem = useVocabularyStore((s) => s.removeItem)
  const reviewItem = useVocabularyStore((s) => s.reviewItem)

  if (!isAuthenticated) {
    return <GuestEmptyState />
  }

  const totalWords = items.length

  // Фильтрация элементов, готовых к повторению
  const readyForPractice = items.filter((item: VocabularyItem) => {
    return item.nextReviewDate ? item.nextReviewDate <= item.createdAt || item.intervalDays === 0 : true
  })

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Словарь и карточки</h1>
          <p className="text-sm text-muted-foreground">
            Всего слов: <span className="font-semibold text-foreground">{totalWords}</span> • К повторению: <span className="font-semibold text-primary">{readyForPractice.length}</span>
          </p>
        </div>
        <AddWordDialog onAdd={addItem} />
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="list" className="gap-2">
            <BookOpen className="h-4 w-4" /> Список слов ({totalWords})
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-2">
            <BrainCircuit className="h-4 w-4" /> Тренировка ({readyForPractice.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VocabularyTable items={items} onDelete={removeItem} />
        </TabsContent>

        <TabsContent value="practice">
          <PracticeView items={readyForPractice} onReview={reviewItem} />
        </TabsContent>
      </Tabs>
    </div>
  )
}