'use client'

import { useState } from 'react'
import { VocabularyItem } from '@/store/useVocabularyStore'
import { useSettingsStore, TargetLanguage } from '@/store/useSettingsStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (item: Omit<VocabularyItem, 'id' | 'createdAt' | 'status'>) => void
}

// Конфиг с примерами под каждый поддерживаемый язык
const PLACEHOLDERS: Record<TargetLanguage, { word: string; translation: string; context: string }> = {
  EN: {
    word: 'Например: resilience',
    translation: 'Например: стойкость',
    context: 'Например: She showed great resilience in tough times.',
  },
  FR: {
    word: 'Например: par exemple',
    translation: 'Например: например',
    context: "Например: C'est un bel exemple.",
  },
  TR: {
    word: 'Например: kelime',
    translation: 'Например: слово',
    context: 'Например: Yeni bir kelime öğrendim.',
  },
}

export function AddWordDialog({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const targetLanguage = useSettingsStore((s) => s.targetLanguage)

  // Получаем примеры для текущего языка
  const currentPlaceholder = PLACEHOLDERS[targetLanguage] || PLACEHOLDERS.EN

  const handleSubmit = (formData: FormData) => {
    const original = formData.get('original') as string
    const translation = formData.get('translation') as string
    const contextSentence = formData.get('contextSentence') as string

    if (!original || !translation) return

    onAdd({
      original: original.trim(),
      translation: translation.trim(),
      sourceLang: targetLanguage,
      targetLang: 'RU',
      contextSentence: contextSentence ? contextSentence.trim() : undefined,
    })

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus className="h-4 w-4" /> Добавить слово ({targetLanguage})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить слово в словарь ({targetLanguage})</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="original">Слово / Фраза</Label>
            <Input 
              id="original" 
              name="original" 
              required 
              placeholder={currentPlaceholder.word} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="translation">Перевод (на русский)</Label>
            <Input 
              id="translation" 
              name="translation" 
              required 
              placeholder={currentPlaceholder.translation} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contextSentence">Контекстное предложение (опционально)</Label>
            <Input 
              id="contextSentence" 
              name="contextSentence" 
              placeholder={currentPlaceholder.context} 
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Отмена
            </Button>
            <Button type="submit" className="cursor-pointer">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}