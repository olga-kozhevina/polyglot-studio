import { LanguageCode, VocabularyWord } from '@/types/vocabulary'

export const speakWord = (text: string, lang: LanguageCode): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

  const langMap: Record<LanguageCode, string> = {
    EN: 'en-US',
    FR: 'fr-FR',
    TR: 'tr-TR',
  }

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = langMap[lang] || 'en-US'

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export const calculateNextReview = (
  word: VocabularyWord,
  grade: 'again' | 'hard' | 'easy'
): VocabularyWord => {
  const NOW = Date.now()
  const DAY_IN_MS = 24 * 60 * 60 * 1000

  let newInterval = word.intervalDays
  let newStatus = word.status

  if (grade === 'again') {
    return {
      ...word,
      status: 'learning',
      intervalDays: 0,
      nextReviewDate: NOW + 60 * 1000, // 1 minute
    }
  }

  if (grade === 'hard') {
    newInterval = Math.max(1, Math.round(word.intervalDays * 1.5))
    newStatus = 'learning'
  }

  if (grade === 'easy') {
    newInterval = word.intervalDays === 0 ? 3 : Math.round(word.intervalDays * 2.5)
    newStatus = newInterval >= 14 ? 'mastered' : 'learning'
  }

  return {
    ...word,
    status: newStatus,
    intervalDays: newInterval,
    nextReviewDate: NOW + newInterval * DAY_IN_MS,
  }
}

/**
 * Safe date formatter ensuring NO Hydration Mismatch between SSR and CSR.
 */
export const formatTimestamp = (timestamp: number): string => {
  const d = new Date(timestamp)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}