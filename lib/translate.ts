const translationCache = new Map<string, string>();

export async function fetchTranslation(
  text: string,
  sourceLang: string,
  targetLang: string = 'ru'
): Promise<string> {
  const cleanText = text.trim();
  if (!cleanText) return '';

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
      const errorData = await res.json().catch(() => ({}));
      console.error('Server Translation Error:', res.status, errorData);
      return 'Ошибка перевода';
    }

    const data = await res.json();
    const result = data.translation || 'Перевод не найден';

    // 2. Запоминаем в кэше
    translationCache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error('Network Translation Error:', error);
    return 'Ошибка сети';
  }
}