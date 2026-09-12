import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const text = searchParams.get('text');
  const from = searchParams.get('from')?.toLowerCase() || 'auto';
  const to = searchParams.get('to')?.toLowerCase() || 'ru';

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is missing' }, { status: 400 });
  }

  try {
    // Надежный серверный запрос к Google Translate (без лимитов, отклик ~150ms)
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;

    const res = await fetch(googleUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`Google API error status: ${res.status}`);
    }

    const data = await res.json();

    // Разбор структуры ответа Google API
    let translation = '';
    if (Array.isArray(data) && Array.isArray(data[0])) {
      translation = data[0]
        .map((item: [string]) => item[0])
        .filter(Boolean)
        .join('');
    }

    if (!translation) {
      translation = 'Перевод не найден';
    }

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation route internal error:', error);
    
    // Резервный фолбэк на MyMemory, если первый сервис не ответил
    try {
      const fallbackUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      const fallbackRes = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();
      const fallbackText = fallbackData.responseData?.translatedText || 'Перевод не найден';
      return NextResponse.json({ translation: fallbackText });
    } catch {
      return NextResponse.json(
        { error: 'Failed to fetch translation from all sources' },
        { status: 500 }
      );
    }
  }
}