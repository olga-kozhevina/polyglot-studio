'use client'

import { useEffect, useState } from 'react'
import { useVocabularyStore } from '@/store/useVocabularyStore'
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
  const sessionQueue = useVocabularyStore((s) => s.sessionQueue)
  const syncUserVocabulary = useVocabularyStore((s) => s.syncUserVocabulary)

  const addItem = useVocabularyStore((s) => s.addItem)
  const removeItem = useVocabularyStore((s) => s.removeItem)
  const reviewItem = useVocabularyStore((s) => s.reviewItem)
  const startPracticeSession = useVocabularyStore((s) => s.startPracticeSession)
  const startCustomPracticeSession = useVocabularyStore((s) => s.startCustomPracticeSession)

  // Управляем активной вкладкой программно, чтобы переключать на тренировку по кнопке из таблицы
  const [activeTab, setActiveTab] = useState<string>('list')

  // Синхронизируем и восстанавливаем сессию при монтировании
  useEffect(() => {
    if (isAuthenticated) {
      syncUserVocabulary()
    }
  }, [isAuthenticated, syncUserVocabulary])

  if (!isAuthenticated) {
    return <GuestEmptyState />
  }

  const totalWords = items.length

  // Обработчик запуска кастомного списка из таблицы
  const handleStartCustomPractice = (itemIds: string[]) => {
    startCustomPracticeSession(itemIds)
    setActiveTab('practice')
  }

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Словарь и карточки</h1>
          <p className="text-sm text-muted-foreground">
            Всего слов: <span className="font-semibold text-foreground">{totalWords}</span> • К повторению: <span className="font-semibold text-primary">{sessionQueue.length}</span>
          </p>
        </div>
        <AddWordDialog onAdd={addItem} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="list" className="gap-2">
            <BookOpen className="h-4 w-4" /> Список слов ({totalWords})
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-2">
            <BrainCircuit className="h-4 w-4" /> Тренировка ({sessionQueue.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VocabularyTable 
            items={items} 
            onDelete={removeItem} 
            onStartCustomPractice={handleStartCustomPractice}
          />
        </TabsContent>

        <TabsContent value="practice">
          <PracticeView items={sessionQueue} onReview={reviewItem} />
        </TabsContent>
      </Tabs>
    </div>
  )
}