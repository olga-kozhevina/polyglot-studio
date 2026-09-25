'use client'

import { useState } from 'react'
import { VocabularyItem } from '@/store/useVocabularyStore'
import { LanguageCode } from '@/types/vocabulary'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (item: Omit<VocabularyItem, 'id' | 'createdAt' | 'status' | 'nextReviewDate' | 'intervalDays' | 'easeFactor'>) => void
}

export function AddWordDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [sourceLang, setSourceLang] = useState<LanguageCode>('EN')

  const handleSubmit = (formData: FormData) => {
    const original = formData.get('original') as string
    const translation = formData.get('translation') as string
    const contextSentence = formData.get('contextSentence') as string

    if (!original || !translation) return

    onAdd({
      original: original.trim(),
      translation: translation.trim(),
      sourceLang,
      targetLang: 'RU',
      contextSentence: contextSentence ? contextSentence.trim() : undefined,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Добавить слово
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить слово в словарь</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="original">Слово / Фраза</Label>
            <Input id="original" name="original" required placeholder="Например: hydration" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Перевод (на русский)</Label>
            <Input id="translation" name="translation" required placeholder="Например: гидратация" />
          </div>

          <div className="space-y-2">
            <Label>Изучаемый язык</Label>
            <Select value={sourceLang} onValueChange={(val) => setSourceLang(val as LanguageCode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EN">Английский (EN)</SelectItem>
                <SelectItem value="FR">Французский (FR)</SelectItem>
                <SelectItem value="TR">Турецкий (TR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contextSentence">Контекстное предложение (опционально)</Label>
            <Input id="contextSentence" name="contextSentence" placeholder="Пример из текста..." />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}