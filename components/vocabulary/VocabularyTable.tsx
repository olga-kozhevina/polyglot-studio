'use client'

import { useState, useTransition } from 'react'
import { VocabularyItem, MasteryStatus } from '@/store/useVocabularyStore'
import { speakWord, formatTimestamp } from '@/lib/spaced-repetition'
import { LanguageCode } from '@/types/vocabulary'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, Trash2, Search } from 'lucide-react'

interface Props {
  items: VocabularyItem[]
  onDelete: (id: string) => void
}

export function VocabularyTable({ items, onDelete }: Props) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState<string>('ALL')
  const [status, setStatus] = useState<string>('ALL')
  const [sortBy, setSortBy] = useState<string>('newest')
  const [, startTransition] = useTransition()

  const filteredItems = items
    .filter((i) => {
      const matchesSearch =
        i.original.toLowerCase().includes(search.toLowerCase()) ||
        i.translation.toLowerCase().includes(search.toLowerCase())
      const matchesLang = language === 'ALL' || i.sourceLang === language
      const matchesStatus = status === 'ALL' || i.status === status
      return matchesSearch && matchesLang && matchesStatus
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return b.createdAt - a.createdAt
      if (sortBy === 'oldest') return a.createdAt - b.createdAt
      if (sortBy === 'alpha') return a.original.localeCompare(b.original)
      if (sortBy === 'review') return (a.nextReviewDate || 0) - (b.nextReviewDate || 0)
      return 0
    })

  const getStatusBadge = (s?: MasteryStatus) => {
    switch (s) {
      case 'new':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">🔵 Новое</Badge>
      case 'learning':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">🟡 В процессе</Badge>
      case 'mastered':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500">🟢 Изучено</Badge>
      default:
        return <Badge variant="outline">🔵 Новое</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по слову..."
            value={search}
            onChange={(e) => {
              const val = e.target.value
              startTransition(() => setSearch(val))
            }}
            className="pl-9"
          />
        </div>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger>
            <SelectValue placeholder="Язык" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все языки</SelectItem>
            <SelectItem value="EN">Английский (EN)</SelectItem>
            <SelectItem value="FR">Французский (FR)</SelectItem>
            <SelectItem value="TR">Турецкий (TR)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Все статусы</SelectItem>
            <SelectItem value="new">Новые</SelectItem>
            <SelectItem value="learning">В процессе</SelectItem>
            <SelectItem value="mastered">Изученные</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Сортировка" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Сначала новые</SelectItem>
            <SelectItem value="oldest">Сначала старые</SelectItem>
            <SelectItem value="alpha">По алфавиту</SelectItem>
            <SelectItem value="review">По дате повторения</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Слово</TableHead>
              <TableHead>Перевод</TableHead>
              <TableHead className="hidden md:table-cell">Контекст</TableHead>
              <TableHead className="hidden sm:table-cell">Добавлено</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Слова не найдены
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{item.original}</span>
                      <Badge variant="secondary" className="text-[10px] px-1 py-0">
                        {item.sourceLang}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{item.translation}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[250px] truncate">
                    {item.contextSentence || '—'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                    {formatTimestamp(item.createdAt)}
                  </TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => speakWord(item.original, item.sourceLang as LanguageCode)}
                      title="Прослушать"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      title="Удалить"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}