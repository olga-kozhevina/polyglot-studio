export interface TranslationResult {
  translation: string;
}

export async function fetchTranslation(
  text: string,
  sourceLang: string,
  targetLang: string = 'ru'
): Promise<TranslationResult> {
  const cleanText = text.trim();
  if (!cleanText) return { translation: '' };

  const src = sourceLang.toLowerCase();
  const tgt = targetLang.toLowerCase();

  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=${src}|${tgt}`
    );
    if (!res.ok) return { translation: 'Ошибка перевода' };
    const data = await res.json();
    return {
      translation: data.responseData?.translatedText || 'Перевод не найден',
    };
  } catch {
    return { translation: 'Ошибка сети' };
  }
}