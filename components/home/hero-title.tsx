'use client'

import { useSettingsStore, TargetLanguage } from '@/store/useSettingsStore'

const LANG_NAMES: Record<TargetLanguage, string> = {
  EN: 'Английском',
  FR: 'Французском',
  TR: 'Турецком',
}

export function HeroTitle() {
  const targetLanguage = useSettingsStore((state) => state.targetLanguage)
  const langInRussian = LANG_NAMES[targetLanguage] || 'иностранном'

  return (
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.15] text-foreground">
      Говорите на{' '}
      <span className="bg-linear-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
        {langInRussian} языке
      </span>{' '}
      уверенно и бегло
    </h1>
  )
}