import { NextResponse } from 'next/server';
import { SERVICE_WORDS } from '@/lib/utils';

// Простой серверный кэш в памяти
const translationCache = new Map<string, string>();

// Утилита для запросов с жестким таймаутом (чтобы не ждать по 20 секунд)
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

// Провайдер 1: Lingva Translate API (Публичные открытые инстансы Google Translate, работающие без блокировок)
async function translateLingva(text: string, from: string, to: string): Promise<string | null> {
  const instances = [
    'https://lingva.ml',
    'https://lingva.lunar.icu',
  ];

  for (const instance of instances) {
    try {
      const url = `${instance}/api/v1/${from}/${to}/${encodeURIComponent(text)}`;
      const res = await fetchWithTimeout(url, {}, 2000);
      if (res.ok) {
        const data = await res.json();
        if (data.translation && data.translation.trim() !== '.') {
          return data.translation.trim();
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

// Провайдер 2: Прямой Google GTX
async function translateGoogle(text: string, from: string, to: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetchWithTimeout(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }, 2500);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const result = data[0].map((item: [string]) => item[0]).filter(Boolean).join('').trim();
        if (result && result !== '.') return result;
      }
    }
  } catch {
    // В случае таймаута или ошибки идем дальше
  }
  return null;
}

// Провайдер 3: MyMemory (Резервный)
async function translateMyMemory(text: string, from: string, to: string): Promise<string | null> {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetchWithTimeout(url, {}, 2500);
    if (res.ok) {
      const data = await res.json();
      const textResult = data.responseData?.translatedText;
      if (textResult && !textResult.includes('MYMEMORY WARNING') && textResult.trim() !== '.') {
        return textResult.trim();
      }
    }
  } catch {
    // Игнорируем ошибку
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

  // Шаг 1: Проверка в локальном словаре служебных слов
  if (SERVICE_WORDS[from] && SERVICE_WORDS[from][cleanTextLower]) {
    return NextResponse.json({ translation: SERVICE_WORDS[from][cleanTextLower] });
  }

  // Шаг 2: Проверка кэша сервера
  const cacheKey = `${from}:${to}:${cleanTextLower}`;
  if (translationCache.has(cacheKey)) {
    return NextResponse.json({ translation: translationCache.get(cacheKey) });
  }

  // Шаг 3: Поочередный опрос провайдеров с таймаутом
  let result = await translateGoogle(text, from, to);

  if (!result) {
    result = await translateLingva(text, from, to);
  }

  if (!result) {
    result = await translateMyMemory(text, from, to);
  }

  // Если всё вернуло пустой перевод или точку
  if (!result || result === '.') {
    result = text; // Показываем сам оригинал, а не сбой/точку
  }

  // Сохраняем в кэш
  translationCache.set(cacheKey, result);

  return NextResponse.json({ translation: result });
}