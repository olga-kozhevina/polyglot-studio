'use client'

import { useState, useDeferredValue } from 'react'
import { VocabularyItem, MasteryStatus } from '@/store/useVocabularyStore'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Trash2, Search, Filter, BrainCircuit, CheckCircle2, Clock, Sparkles } from 'lucide-react'

interface Props { 
  items: VocabularyItem[]
  onDelete: (id: string) => void
  onStartCustomPractice: (itemIds: string[]) => void
  onUpdateStatus?: (id: string, newStatus: MasteryStatus) => void
}

export function VocabularyTable({ items, onDelete, onStartCustomPractice, onUpdateStatus }: Props) {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)

  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Состояние модального окна
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null)

  const handleOpenDetails = (item: VocabularyItem) => {
    setSelectedItem(item)
  }

  // Функция подсветки слова в контексте
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

  const filteredItems = items
    .filter((i) => {
      const query = deferredSearch.toLowerCase()
      const matchesSearch =
        i.original.toLowerCase().includes(query) ||
        i.translation.toLowerCase().includes(query)
      const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => b.createdAt - a.createdAt)

  const getStatusBadge = (s?: MasteryStatus) => {
    switch (s) {
      case 'new':
        return <Badge variant="outline" className="border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10 text-xs font-medium px-2.5 py-0.5">Новое</Badge>
      case 'learning':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 text-xs font-medium px-2.5 py-0.5">Изучаю</Badge>
      case 'mastered':
        return <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-xs font-medium px-2.5 py-0.5">Выучено</Badge>
      default:
        return <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5">Новое</Badge>
    }
  }

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden">
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

        <div className="flex flex-wrap items-center justify-between min-[900px]:justify-end gap-2">
          {filteredItems.length > 0 && (
            <Button
              onClick={() => {
                const itemIds = filteredItems.map((i) => i.id)
                onStartCustomPractice(itemIds)
              }}
              className="w-full sm:w-auto h-10 gap-2 text-xs sm:text-sm order-2 sm:order-1"
            >
              <BrainCircuit className="h-4 w-4 shrink-0 text-primary-foreground" />
              <span>Тренировать этот список ({filteredItems.length})</span>
            </Button>
          )}

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 text-xs sm:text-sm order-1 sm:order-2">
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Статус" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="learning">Изучаю</SelectItem>
              <SelectItem value="mastered">Выучено</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm w-full px-0.5 sm:px-0">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="font-semibold text-foreground py-3 pl-3.5 sm:pl-6 w-[42%] sm:w-[35%] text-xs sm:text-sm">Слово</TableHead>
              <TableHead className="font-semibold text-foreground py-3 w-[42%] sm:w-[45%] text-xs sm:text-sm">Перевод</TableHead>
              <TableHead className="hidden sm:table-cell font-semibold text-foreground py-3 w-[20%]">Статус</TableHead>
              <TableHead className="text-right font-semibold text-foreground py-3 pr-3.5 sm:pr-6 w-[20%] text-xs sm:text-sm">Удалить</TableHead>
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
                <TableRow 
                  key={item.id} 
                  onClick={() => handleOpenDetails(item)}
                  className="cursor-pointer transition-colors hover:bg-muted/50 group"
                >
                  <TableCell className="font-medium pl-3 sm:pl-6 py-3 truncate">
                    <div className="flex flex-col gap-0.5 overflow-hidden">
                      <span className="text-xs sm:text-base truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.original}
                      </span>
                      <div className="sm:hidden w-fit scale-95 origin-left">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground font-medium text-xs sm:text-base py-3 truncate">
                    <span className="truncate block">{item.translation}</span>
                  </TableCell>

                  <TableCell className="hidden sm:table-cell py-3 truncate">
                    {getStatusBadge(item.status)}
                  </TableCell>

                  <TableCell className="text-right pr-3 sm:pr-6 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(item.id)}
                        title="Удалить слово"
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

      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-xl">
          <DialogHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4 pr-6">
              <div className="space-y-1.5 w-full">
                <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {selectedItem?.original}
                </DialogTitle>

                <DialogDescription className="text-base sm:text-lg text-muted-foreground">
                  Перевод: <strong className="text-foreground font-semibold">{selectedItem?.translation}</strong>
                </DialogDescription>
              </div>
            </div>

            {/* Интерактивная смена статуса прямо в модалке с четким выделением */}
            <div className="space-y-2.5 pt-3 border-t">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Изменить статус изучения:</span>
              </div>
              
              <div className="grid grid-cols-1 min-[500px]:grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={selectedItem?.status === 'new' ? 'default' : 'outline'}
                  onClick={() => {
                    if (selectedItem && onUpdateStatus) {
                      onUpdateStatus(selectedItem.id, 'new')
                      setSelectedItem({ ...selectedItem, status: 'new' })
                    }
                  }}
                  className={`h-9 text-xs gap-1.5 font-medium cursor-pointer ${
                    selectedItem?.status === 'new'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                      : 'border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Новое</span>
                </Button>

                <Button
                  size="sm"
                  variant={selectedItem?.status === 'learning' ? 'default' : 'outline'}
                  onClick={() => {
                    if (selectedItem && onUpdateStatus) {
                      onUpdateStatus(selectedItem.id, 'learning')
                      setSelectedItem({ ...selectedItem, status: 'learning' })
                    }
                  }}
                  className={`h-9 text-xs gap-1.5 font-medium cursor-pointer ${
                    selectedItem?.status === 'learning'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                      : 'border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Изучаю</span>
                </Button>

                <Button
                  size="sm"
                  variant={selectedItem?.status === 'mastered' ? 'default' : 'outline'}
                  onClick={() => {
                    if (selectedItem && onUpdateStatus) {
                      onUpdateStatus(selectedItem.id, 'mastered')
                      setSelectedItem({ ...selectedItem, status: 'mastered' })
                    }
                  }}
                  className={`h-9 text-xs gap-1.5 font-medium cursor-pointer ${
                    selectedItem?.status === 'mastered'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Выучено</span>
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Контекст использования */}
          <div className="space-y-3 py-2">
            {selectedItem?.contextSentence ? (
              <div className="rounded-xl bg-muted/60 p-4 space-y-2 border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Контекст использования:</span>
                <p className="text-base sm:text-lg leading-relaxed text-foreground font-normal">
                  {highlightWordInContext(selectedItem.contextSentence, selectedItem.original)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic text-center py-2">Контекст для этого слова не добавлен</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}