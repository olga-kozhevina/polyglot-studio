import { NextResponse } from 'next/server';
import { SERVICE_WORDS } from '@/lib/utils';

interface TranslationData {
  translation: string;
}

// Ограничиваем размер In-Memory кэша для предотвращения Memory Leak
const MAX_CACHE_SIZE = 1000;
const translationCache = new Map<string, TranslationData>();

function setCache(key: string, value: TranslationData) {
  if (translationCache.size >= MAX_CACHE_SIZE) {
    const firstKey = translationCache.keys().next().value;
    if (firstKey) translationCache.delete(firstKey);
  }
  translationCache.set(key, value);
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 2500
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function translateGoogle(
  text: string,
  from: string,
  to: string
): Promise<TranslationData | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      text
    )}`;

    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      },
      2500
    );

    if (res.ok) {
      const data = await res.json();
      let translation = '';

      if (Array.isArray(data) && Array.isArray(data[0])) {
        translation = data[0]
          .map((item: unknown) => (Array.isArray(item) && typeof item[0] === 'string' ? item[0] : ''))
          .filter(Boolean)
          .join('')
          .trim();
      }

      if (translation && translation !== '.') {
        return {
          translation,
        };
      }
    }
  } catch {
    // Таймаут или сетевая ошибка API
  }

  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();
  const from = searchParams.get('from')?.toLowerCase() || 'auto';
  const to = searchParams.get('to')?.toLowerCase() || 'ru';

  if (!text) {
    return NextResponse.json(
      { error: 'Text parameter is missing' },
      { status: 400 }
    );
  }

  const cleanTextLower = text.toLowerCase();
  const cacheKey = `${from}:${to}:${cleanTextLower}`;

  if (translationCache.has(cacheKey)) {
    return NextResponse.json(translationCache.get(cacheKey)!);
  }

  if (SERVICE_WORDS[from] && SERVICE_WORDS[from][cleanTextLower]) {
    const word = SERVICE_WORDS[from][cleanTextLower];
    const serviceResult: TranslationData = { translation: word };
    setCache(cacheKey, serviceResult);
    return NextResponse.json(serviceResult);
  }

  const result = (await translateGoogle(text, from, to)) || {
    translation: text,
  };

  setCache(cacheKey, result);
  return NextResponse.json(result);
}