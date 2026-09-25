'use client'

import { useState, useDeferredValue } from 'react'
import { VocabularyItem, MasteryStatus } from '@/store/useVocabularyStore'
import { speakWord } from '@/lib/spaced-repetition'
import { LanguageCode } from '@/types/vocabulary'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Volume2, Trash2, Search, Filter, BrainCircuit } from 'lucide-react'

interface Props {
  items: VocabularyItem[]
  onDelete: (id: string) => void
  onStartCustomPractice: (itemIds: string[]) => void
}

export function VocabularyTable({ items, onDelete, onStartCustomPractice }: Props) {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Состояние для модального окна просмотра деталей слова
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null)

  const filteredItems = items
    .filter((i) => {
      const query = deferredSearch.toLowerCase()
      const matchesSearch =
        i.original.toLowerCase().includes(query) ||
        i.translation.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => b.createdAt - a.createdAt) // Дефолтная сортировка: сначала новые

  const getStatusBadge = (s?: MasteryStatus) => {
    switch (s) {
      case 'new':
        return <Badge variant="outline" className="border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10 text-xs font-medium px-2.5 py-0.5">Новое</Badge>
      case 'learning':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-medium px-2.5 py-0.5">Учу</Badge>
      case 'mastered':
        return <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-medium px-2.5 py-0.5">Выучено</Badge>
      default:
        return <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5">Новое</Badge>
    }
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
      {/* Панель управления: поиск, фильтр статусов и кнопка тренировки отфильтрованного списка */}
      <div className="flex flex-col min-[900px]:flex-row items-stretch min-[900px]:items-center justify-between gap-3">
        <div className="relative w-full min-[900px]:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по словам или переводу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 w-full h-10 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 text-xs sm:text-sm">
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Статус" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="learning">Учу</SelectItem>
              <SelectItem value="mastered">Выучено</SelectItem>
            </SelectContent>
          </Select>

          {/* Кнопка запуска тренировки по текущему отфильтрованному списку */}
          {filteredItems.length > 0 && (
            <Button
              variant="secondary"
              size="default"
              onClick={() => {
                const itemIds = filteredItems.map((i) => i.id)
                onStartCustomPractice(itemIds)
              }}
              className="w-full sm:w-auto h-10 gap-2 border-primary/20 hover:border-primary/50 text-xs sm:text-sm"
            >
              <BrainCircuit className="h-4 w-4 text-primary shrink-0" />
              <span>Тренировать этот список ({filteredItems.length})</span>
            </Button>
          )}
        </div>
      </div>

      {/* Таблица */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm w-full">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3 pl-3 sm:pl-6 w-[45%] sm:w-[35%] text-xs sm:text-sm">Слово</TableHead>
              <TableHead className="font-semibold text-foreground py-3 w-[45%] sm:w-[45%] text-xs sm:text-sm">Перевод</TableHead>
              <TableHead className="hidden sm:table-cell font-semibold text-foreground py-3 w-[20%]">Статус</TableHead>
              <TableHead className="text-right font-semibold text-foreground py-3 pr-3 sm:pr-6 w-[20%] text-xs sm:text-sm">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground text-xs sm:text-sm">
                  <p className="font-medium">Слова не найдены</p>
                  <p className="text-xs text-muted-foreground/80 mt-1">Попробуйте изменить параметры поиска или фильтрации</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id} className="transition-colors">
                  {/* Слово (Кликабельное для открытия модалки) */}
                  <TableCell className="font-medium pl-3 sm:pl-6 py-3 truncate">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-xs sm:text-base truncate font-semibold text-left hover:underline focus:outline-none text-primary"
                        title="Нажмите, чтобы посмотреть детали"
                      >
                        {item.original}
                      </button>
                      <div className="sm:hidden w-fit scale-95 origin-left">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </TableCell>

                  {/* Перевод */}
                  <TableCell className="text-muted-foreground font-medium text-xs sm:text-base py-3 truncate">
                    <span className="truncate block">{item.translation}</span>
                  </TableCell>

                  {/* Статус (планшет и десктоп) */}
                  <TableCell className="hidden sm:table-cell py-3 truncate">
                    {getStatusBadge(item.status)}
                  </TableCell>

                  {/* Кнопка удаления */}
                  <TableCell className="text-right pr-3 sm:pr-6 py-3">
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        title="Удалить"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive/80 hover:text-destructive hover:bg-destructive/10 shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Модальное окно просмотра деталей слова */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl font-bold">
              <span>{selectedItem?.original}</span>
              {selectedItem && getStatusBadge(selectedItem.status)}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground pt-1">
              Перевод: <strong className="text-foreground">{selectedItem?.translation}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {selectedItem?.contextSentence && (
              <div className="rounded-lg bg-muted/50 p-3 text-sm space-y-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Контекст / Пример:</span>
                <p className="italic text-foreground">{selectedItem.contextSentence}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedItem) {
                    speakWord(selectedItem.original, selectedItem.sourceLang as LanguageCode)
                  }
                }}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" /> Озвучить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}