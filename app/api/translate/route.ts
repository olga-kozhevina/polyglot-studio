import { NextResponse } from 'next/server';
import { SERVICE_WORDS } from '@/lib/utils';

interface TranslationData {
  translation: string;
  transcription?: string;
}

const translationCache = new Map<string, TranslationData>();

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function translateGoogle(text: string, from: string, to: string): Promise<TranslationData | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=rm&q=${encodeURIComponent(text)}`;
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }, 2500);

    if (res.ok) {
      const data = await res.json();
      let translation = '';
      let transcription = '';

      if (Array.isArray(data) && Array.isArray(data[0])) {
        translation = data[0].map((item: [string]) => item[0]).filter(Boolean).join('').trim();
      }

      // Расширенный поиск транскрипции в структуре Google GTX
      if (Array.isArray(data[0])) {
        for (const item of data[0]) {
          if (item && item[3]) {
            transcription = item[3];
            break;
          }
        }
      }
      if (!transcription && data[1] && Array.isArray(data[1])) {
        for (const item of data[1]) {
          if (item && Array.isArray(item) && item[2]) {
            transcription = item[2];
            break;
          }
        }
      }
      if (!transcription && data[3] && typeof data[3] === 'string') {
        transcription = data[3];
      }

      if (translation && translation !== '.') {
        return {
          translation,
          transcription: transcription ? transcription.trim() : undefined,
        };
      }
    }
  } catch {
    // Игнорируем ошибки таймаута
  }
  return null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text')?.trim();
  const from = searchParams.get('from')?.toLowerCase() || 'auto';
  const to = searchParams.get('to')?.toLowerCase() || 'ru';

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is missing' }, { status: 400 });
  }

  const cleanTextLower = text.toLowerCase();
  const cacheKey = `${from}:${to}:${cleanTextLower}`;

  if (translationCache.has(cacheKey)) {
    return NextResponse.json(translationCache.get(cacheKey)!);
  }

  if (SERVICE_WORDS[from] && SERVICE_WORDS[from][cleanTextLower]) {
    const word = SERVICE_WORDS[from][cleanTextLower];
    const serviceResult: TranslationData = { translation: word };
    translationCache.set(cacheKey, serviceResult);
    return NextResponse.json(serviceResult);
  }

  const result = await translateGoogle(text, from, to) || {
    translation: text,
  };

  translationCache.set(cacheKey, result);
  return NextResponse.json(result);
}