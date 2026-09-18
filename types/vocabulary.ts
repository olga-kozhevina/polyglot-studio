export type MasteryStatus = 'new' | 'learning' | 'mastered'
export type LanguageCode = 'EN' | 'FR' | 'TR'

export interface VocabularyWord {
  id: string
  original: string
  translation: string
  language: LanguageCode
  contextSentence?: string
  sourceTextId?: string
  createdAt: number
  
  // Spaced Repetition fields
  status: MasteryStatus
  nextReviewDate: number
  intervalDays: number
  easeFactor: number
}