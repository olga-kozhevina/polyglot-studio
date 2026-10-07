export interface TranslationResult {
  translation: string;
  audioUrl?: string;
}

const translationCache = new Map<string, TranslationResult>();

export async function fetchTranslation(
  text: string,
  sourceLang: string,
  targetLang: string = 'ru'
): Promise<TranslationResult> {
  const cleanText = text.trim();
  if (!cleanText) return { translation: '' };

  const src = sourceLang.toLowerCase();
  const tgt = targetLang.toLowerCase();
  const cacheKey = `${src}:${tgt}:${cleanText.toLowerCase()}`;

  // 1. Возвращаем мгновенно из кэша (0ms)
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const res = await fetch(
      `/api/translate?text=${encodeURIComponent(cleanText)}&from=${src}&to=${tgt}`
    );

    if (!res.ok) {
      return { translation: 'Ошибка перевода' };
    }

    const data = await res.json();
    const result: TranslationResult = {
      translation: data.translation || 'Перевод не найден',
      audioUrl: data.audioUrl || undefined,
    };

    // 2. Запоминаем в кэше
    translationCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Network Translation Error:', error);
    return { translation: 'Ошибка сети' };
  }
}