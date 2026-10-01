'use client'

import { useEffect, useState } from 'react'
import { useVocabularyStore, MasteryStatus } from '@/store/useVocabularyStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useSettingsStore } from '@/store/useSettingsStore'
import { GuestEmptyState } from '@/components/vocabulary/GuestEmptyState'
import { VocabularyTable } from '@/components/vocabulary/VocabularyTable'
import { PracticeView } from '@/components/vocabulary/PracticeView'
import { AddWordDialog } from '@/components/vocabulary/AddWordDialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, BrainCircuit } from 'lucide-react'

export default function VocabularyPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const targetLanguage = useSettingsStore((s) => s.targetLanguage)

  const items = useVocabularyStore((s) => s.items)
  const sessionQueue = useVocabularyStore((s) => s.sessionQueue)
  const syncUserVocabulary = useVocabularyStore((s) => s.syncUserVocabulary)

  const addItem = useVocabularyStore((s) => s.addItem)
  const removeItem = useVocabularyStore((s) => s.removeItem)
  const reviewItem = useVocabularyStore((s) => s.reviewItem)
  const startCustomPracticeSession = useVocabularyStore((s) => s.startCustomPracticeSession)
  const updateItemStatus = useVocabularyStore((s) => s.updateItemStatus)

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

  const filteredItemsByLang = items.filter((item) => item.sourceLang === targetLanguage)
  const filteredQueueByLang = sessionQueue.filter((item) => item.sourceLang === targetLanguage)

  const totalWords = filteredItemsByLang.length

  // Обработчик запуска кастомного списка из отфильтрованной таблицы
  const handleStartCustomPractice = (itemIds: string[]) => {
    startCustomPracticeSession(itemIds)
    setActiveTab('practice')
  }

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Словарь и карточки ({targetLanguage})</h1>
          <p className="text-sm text-muted-foreground">
            Всего слов: <span className="font-semibold text-foreground">{totalWords}</span> • К повторению: <span className="font-semibold text-primary">{filteredQueueByLang.length}</span>
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
            <BrainCircuit className="h-4 w-4" /> Тренировка ({filteredQueueByLang.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <VocabularyTable 
            items={filteredItemsByLang} 
            onDelete={removeItem} 
            onStartCustomPractice={handleStartCustomPractice}
            onUpdateStatus={updateItemStatus}
          />
        </TabsContent>

        <TabsContent value="practice">
          <PracticeView items={filteredQueueByLang} onReview={reviewItem} />
        </TabsContent>
      </Tabs>
    </div>
  )
}